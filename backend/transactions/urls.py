from django.urls import path
from .views import TransactionListView, TransactionDetailView, InitiateReturnView, ConfirmReturnView

urlpatterns = [
    path('', TransactionListView.as_view(), name='transaction_list'),
    path('<int:pk>/', TransactionDetailView.as_view(), name='transaction_detail'),
    path('<int:pk>/return/', InitiateReturnView.as_view(),
         name='transaction_return'),
    path('<int:pk>/confirm/', ConfirmReturnView.as_view(),
         name='transaction_confirm'),
]
