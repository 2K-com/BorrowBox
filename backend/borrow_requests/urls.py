from django.urls import path
from .views import (
    BorrowRequestCreateView, IncomingRequestsView, OutgoingRequestsView,
    AcceptRequestView, RejectRequestView, CancelRequestView, MarkReturnedView
)

urlpatterns = [
    path('', BorrowRequestCreateView.as_view(), name='borrow_request_create'),
    path('incoming/', IncomingRequestsView.as_view(), name='requests_incoming'),
    path('outgoing/', OutgoingRequestsView.as_view(), name='requests_outgoing'),
    path('<int:pk>/accept/', AcceptRequestView.as_view(), name='request_accept'),
    path('<int:pk>/reject/', RejectRequestView.as_view(), name='request_reject'),
    path('<int:pk>/cancel/', CancelRequestView.as_view(), name='request_cancel'),
    path('<int:pk>/return/', MarkReturnedView.as_view(), name='mark-returned'),
]
