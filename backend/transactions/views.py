from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Transaction
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
        transaction = get_object_or_404(Transaction, id=pk)
        self.check_object_permissions(request, transaction)
        
        if transaction.status != 'ACTIVE':
            return Response({"error": "Only active transactions can be returned."}, status=status.HTTP_400_BAD_REQUEST)

        transaction.status = 'RETURN_PENDING'
        transaction.save()
        return Response({"status": "Item marked as returned. Awaiting owner confirmation."})


class ConfirmReturnView(APIView):
    """PATCH: Owner confirms receipt. Closes transaction and releases item back to catalog."""
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def patch(self, request, pk):
        transaction = get_object_or_404(Transaction, id=pk)
        self.check_object_permissions(request, transaction)
        
        if transaction.status != 'RETURN_PENDING':
            return Response({"error": "No return request is pending for this item."}, status=status.HTTP_400_BAD_REQUEST)

        # Complete transaction lifecycle
        transaction.status = 'COMPLETED'
        transaction.save()

        # Release item back to public marketplace listings
        listing = transaction.listing
        listing.availability_status = 'AVAILABLE'
        listing.save()

        return Response({"status": "Return confirmed. Transaction closed and item is listed again."})
