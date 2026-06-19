from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer


class IsNotificationOwner(permissions.BasePermission):
    """
    Custom permission to ensure users can only access/modify their own notifications.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class NotificationListView(generics.ListAPIView):
    """
    GET /api/notifications/
    Returns notifications belonging to the authenticated user, ordered by newest first.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class NotificationReadView(APIView):
    """
    PATCH /api/notifications/<id>/read/
    Marks the notification as read. Validates that the current user is the owner.
    """
    permission_classes = [permissions.IsAuthenticated, IsNotificationOwner]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, id=pk)
        self.check_object_permissions(request, notification)
        
        notification.is_read = True
        notification.save()
        
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UnreadNotificationCountView(APIView):
    """
    GET /api/notifications/unread-count/
    Returns the count of unread notifications for the current user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"count": count}, status=status.HTTP_200_OK)
