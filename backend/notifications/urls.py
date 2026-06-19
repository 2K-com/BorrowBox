from django.urls import path
from .views import (
    NotificationListView,
    NotificationReadView,
    UnreadNotificationCountView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('<int:pk>/read/', NotificationReadView.as_view(), name='notification_read'),
    path('unread-count/', UnreadNotificationCountView.as_view(), name='notification_unread_count'),
]
