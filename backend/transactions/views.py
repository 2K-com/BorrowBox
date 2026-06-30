from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import transaction  # Added for safe multi-table updates
from .models import Transaction, Review
from .serializers import TransactionSerializer
from config.permissions import IsParticipant, IsBorrower, IsOwner


class TransactionListView(generics.ListAPIView):
    """GET: Retrieve all active and historical rentals involving the current user."""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(Q(borrower=user) | Q(owner=user)).order_by('-created_at')


class TransactionDetailView(generics.RetrieveAPIView):
    """GET: Fetch comprehensive contract, price, and date breakdowns for a specific lease."""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(Q(borrower=user) | Q(owner=user))


class InitiateReturnView(APIView):
    """PATCH: Borrower declares they have handed back the physical item."""
    permission_classes = [permissions.IsAuthenticated, IsBorrower]

    def patch(self, request, pk):
        transaction_obj = get_object_or_404(Transaction, id=pk)
        self.check_object_permissions(request, transaction_obj)

        if transaction_obj.status != 'ACTIVE':
            return Response({"error": "Only active transactions can be returned."}, status=status.HTTP_400_BAD_REQUEST)

        transaction_obj.status = 'RETURN_PENDING'
        transaction_obj.save()
        return Response({"status": "Item marked as returned. Awaiting owner confirmation."})


class ConfirmReturnView(APIView):
    """PATCH: Owner confirms receipt. Closes transaction and releases item back to catalog."""
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def patch(self, request, pk):
        transaction_obj = get_object_or_404(Transaction, id=pk)
        self.check_object_permissions(request, transaction_obj)

        if transaction_obj.status != 'RETURN_PENDING':
            return Response({"error": "No return request is pending for this item."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Complete transaction lifecycle
            transaction_obj.status = 'COMPLETED'
            transaction_obj.save()

            # Release item back to public marketplace listings
            listing = transaction_obj.listing
            listing.availability_status = 'AVAILABLE'
            listing.save()

        return Response({"status": "Return confirmed. Transaction closed and item is listed again."})


class CompleteTransactionView(APIView):
    """PATCH: Directly completes the transaction and processes the user rating."""
    # Changed to IsParticipant so the Borrower can actually trigger this from the UI
    permission_classes = [permissions.IsAuthenticated, IsParticipant]

    def patch(self, request, pk):
        transaction_obj = get_object_or_404(Transaction, pk=pk)
        self.check_object_permissions(request, transaction_obj)

        if transaction_obj.status != 'ACTIVE':
            return Response(
                {"error": "Only active transactions can be completed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # 1. Mark transaction as completed
            transaction_obj.status = 'COMPLETED'
            transaction_obj.save()

            # 2. Reset the listing availability
            listing = transaction_obj.listing
            listing.availability_status = 'AVAILABLE'
            listing.save()

            # 3. Mark the original Borrow Request as returned
            if hasattr(transaction_obj, 'borrow_request') and transaction_obj.borrow_request:
                borrow_request = transaction_obj.borrow_request
                borrow_request.status = 'RETURNED'
                borrow_request.save()

            # 4. Extract and save the Rating
            rating = request.data.get('rating')
            if rating:
                # Figure out who gets the rating (Borrower rates Owner, Owner rates Borrower)
                receiver = transaction_obj.owner if request.user == transaction_obj.borrower else transaction_obj.borrower

                Review.objects.create(
                    transaction=transaction_obj,
                    reviewer=request.user,
                    receiver=receiver,
                    rating=rating,
                    comment="Automated rating from return process."
                )

        return Response({"status": "Item returned, transaction closed, and rating saved."}, status=status.HTTP_200_OK)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # 1. Import inside the function to prevent Circular Import crashes
            from django.utils import timezone
            from datetime import timedelta
            from django.db.models import Sum, Avg
            from listings.models import Listing
            from transactions.models import Transaction
            from borrow_requests.models import BorrowRequest

            user = request.user
            now = timezone.now()
            next_week = now + timedelta(days=7)

            # 2. Listing Data
            total_listings = Listing.objects.filter(owner=user).count()
            available_listings = Listing.objects.filter(
                owner=user, availability_status='AVAILABLE').count()

            # 3. Transaction Counts
            active_borrowings = Transaction.objects.filter(
                borrower=user, status='ACTIVE').count()
            active_lendings = Transaction.objects.filter(
                owner=user, status='ACTIVE').count()
            pending_requests = BorrowRequest.objects.filter(
                owner=user, status='PENDING').count()
            returns_due = Transaction.objects.filter(
                borrower=user, status='ACTIVE', end_date__lte=next_week).count()

            # 4. Financial Aggregations
            rent_earned = Transaction.objects.filter(owner=user, status='COMPLETED').aggregate(
                Sum('price_per_day'))['price_per_day__sum'] or 0
            rent_paid = Transaction.objects.filter(borrower=user, status='COMPLETED').aggregate(
                Sum('price_per_day'))['price_per_day__sum'] or 0
            avg_rating_dict = Review.objects.filter(
                receiver=user).aggregate(Avg('rating'))
            avg_rating = avg_rating_dict['rating__avg']
            user_rating = round(
                avg_rating, 1) if avg_rating is not None else 0.0

            return Response({
                "total_listings": total_listings,
                "available_listings": available_listings,
                "active_borrowings": active_borrowings,
                "active_lendings": active_lendings,
                "pending_requests": pending_requests,
                "returns_due_this_week": returns_due,
                "total_rent_earned": rent_earned,
                "total_rent_paid": rent_paid,
                "reputation_rating": user_rating,
                "member_since": user.date_joined.strftime("%B %Y") if hasattr(user, 'date_joined') else "January 2025"
            })

        except Exception as e:
            # If it crashes again, print the exact Python error to the Django terminal
            import traceback
            print("--- DASHBOARD STATS CRASH ---")
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
