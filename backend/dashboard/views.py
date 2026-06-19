from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from listings.models import Listing
from borrow_requests.models import BorrowRequest
from transactions.models import Transaction
from notifications.models import Notification


class DashboardView(APIView):
    """
    GET /api/dashboard/
    Authenticated users only.
    Returns metrics and counts for the user's listings, borrow requests, borrowings, and notifications.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        total_listings = Listing.objects.filter(owner=user).count()
        pending_requests = BorrowRequest.objects.filter(owner=user, status='PENDING').count()
        active_borrowings = Transaction.objects.filter(borrower=user, status='ACTIVE').count()
        completed_transactions = Transaction.objects.filter(borrower=user, status='COMPLETED').count()
        unread_notifications = Notification.objects.filter(user=user, is_read=False).count()

        data = {
            "total_listings": total_listings,
            "pending_requests": pending_requests,
            "active_borrowings": active_borrowings,
            "completed_transactions": completed_transactions,
            "unread_notifications": unread_notifications
        }

        return Response(data, status=status.HTTP_200_OK)
