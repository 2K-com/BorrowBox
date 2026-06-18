from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Listing, Category
from .serializers import ListingSerializer, CategorySerializer


class CategoryListView(generics.ListAPIView):
    """Public view to fetch categories for dropdown menus."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ListingListCreateView(generics.ListCreateAPIView):
    """
    GET: View all active marketplace listings (Public).
    POST: Create a new listing (Authenticated users only).
    """
    queryset = Listing.objects.filter(
        availability_status='AVAILABLE').order_by('-created_at')
    serializer_class = ListingSerializer

    # Configure filtering and global search mechanics
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'condition']
    search_fields = ['title', 'description', 'location']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the listing owner
        serializer.save(owner=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Fetch a single listing details (Public).
    PUT/PATCH: Update your own listing (Protected - requires custom IsOwner permission later).
    DELETE: Remove your own listing (Protected).
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Temporary placeholder until partner provides custom IsOwner permission object
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class MyListingsView(generics.ListAPIView):
    """GET: Fetch only the listings belonging to the logged-in user."""
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(owner=self.request.user).order_by('-created_at')
