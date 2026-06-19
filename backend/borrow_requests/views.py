from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import BorrowRequest
from .serializers import BorrowRequestSerializer
from listings.models import Listing
from transactions.models import Transaction
from config.permissions import IsListingOwner, IsBorrower


class BorrowRequestCreateView(generics.CreateAPIView):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        listing = get_object_or_404(
            Listing, id=self.request.data.get('listing'))
        serializer.save(borrower=self.request.user, owner=listing.owner)
        
        from notifications.utils import create_notification
        create_notification(
            user=listing.owner,
            title="New Borrow Request",
            message=f"{self.request.user.username} wants to borrow your item.",
            notification_type="REQUEST_RECEIVED"
        )


class IncomingRequestsView(generics.ListAPIView):
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BorrowRequest.objects.filter(owner=self.request.user).order_by('-created_at')


class OutgoingRequestsView(generics.ListAPIView):
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BorrowRequest.objects.filter(borrower=self.request.user).order_by('-created_at')


class AcceptRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsListingOwner]

    def patch(self, request, pk):
        borrow_request = get_object_or_404(BorrowRequest, id=pk)
        self.check_object_permissions(request, borrow_request)

        if borrow_request.status != 'PENDING':
            return Response({"error": "Request is no longer pending"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            borrow_request.status = 'ACCEPTED'
            borrow_request.save()

            listing = borrow_request.listing
            listing.availability_status = 'BORROWED'
            listing.save()

            # Create the corresponding Transaction atomically
            Transaction.objects.create(
                listing=listing,
                borrower=borrow_request.borrower,
                owner=borrow_request.owner,
                borrow_request=borrow_request,
                start_date=borrow_request.start_date,
                end_date=borrow_request.end_date,
                price_per_day=listing.price_per_day,
                status='ACTIVE'
            )

            # Create notification for Borrower
            from notifications.utils import create_notification
            create_notification(
                user=borrow_request.borrower,
                title="Request Accepted",
                message="Your borrow request has been accepted.",
                notification_type="REQUEST_ACCEPTED"
            )

        return Response({"status": "Request accepted, item reserved, and transaction initiated."})


class RejectRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsListingOwner]

    def patch(self, request, pk):
        borrow_request = get_object_or_404(BorrowRequest, id=pk)
        self.check_object_permissions(request, borrow_request)

        if borrow_request.status != 'PENDING':
            return Response({"error": "Only pending requests can be rejected."}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'REJECTED'
        borrow_request.save()
        
        # Create notification for Borrower
        from notifications.utils import create_notification
        create_notification(
            user=borrow_request.borrower,
            title="Request Rejected",
            message="Your borrow request has been rejected.",
            notification_type="REQUEST_REJECTED"
        )
        return Response({"status": "Request rejected."})


class CancelRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBorrower]

    def patch(self, request, pk):
        borrow_request = get_object_or_404(BorrowRequest, id=pk)
        self.check_object_permissions(request, borrow_request)

        if borrow_request.status != 'PENDING':
            return Response({"error": "Only pending requests can be cancelled."}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'CANCELLED'
        borrow_request.save()
        return Response({"status": "Request cancelled."})
