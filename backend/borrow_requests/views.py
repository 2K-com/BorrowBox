from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import BorrowRequest
from .serializers import BorrowRequestSerializer
from listings.models import Listing
from transactions.models import Transaction


class BorrowRequestCreateView(generics.CreateAPIView):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        listing = get_object_or_404(
            Listing, id=self.request.data.get('listing'))
        serializer.save(borrower=self.request.user, owner=listing.owner)


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
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        borrow_request = get_object_or_404(
            BorrowRequest, id=pk, owner=request.user)
        if borrow_request.status != 'PENDING':
            return Response({"error": "Request is no longer pending"}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'ACCEPTED'
        borrow_request.save()

        listing = borrow_request.listing
        listing.availability_status = 'BORROWED'
        listing.save()

        return Response({"status": "Request accepted, item reserved."})


class RejectRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        borrow_request = get_object_or_404(
            BorrowRequest, id=pk, owner=request.user)
        borrow_request.status = 'REJECTED'
        borrow_request.save()
        return Response({"status": "Request rejected."})


class CancelRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        borrow_request = get_object_or_404(
            BorrowRequest, id=pk, borrower=request.user)
        borrow_request.status = 'CANCELLED'
        borrow_request.save()
        return Response({"status": "Request cancelled."})
