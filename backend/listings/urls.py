from django.urls import path
from .views import CategoryListView, ListingListCreateView, ListingDetailView, MyListingsView

urlpatterns = [
    path('', ListingListCreateView.as_view(), name='listing_list_create'),
    path('<int:pk>/', ListingDetailView.as_view(), name='listing_detail'),
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('my/', MyListingsView.as_view(), name='my_listings'),
]
