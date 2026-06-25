from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q  # Added for complex queries
from config.permissions import IsOwner
from .models import Listing, Category
from .serializers import ListingSerializer, CategorySerializer


class CategoryListView(generics.ListAPIView):
    """Public view to fetch categories for dropdown menus."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ListingListCreateView(generics.ListCreateAPIView):
    """
    GET: View all active marketplace listings (plus own borrowed items if authenticated).
    POST: Create a new listing (Authenticated users only).
    """
    serializer_class = ListingSerializer

    # Configure filtering and global search mechanics
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'condition']
    search_fields = ['title', 'description', 'location']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user

        # If logged in, return AVAILABLE items OR items owned by the user
        if user.is_authenticated:
            return Listing.objects.filter(
                Q(availability_status='AVAILABLE') | Q(owner=user)
            ).order_by('-created_at')

        # If guest, strictly return AVAILABLE items
        return Listing.objects.filter(availability_status='AVAILABLE').order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the listing owner
        serializer.save(owner=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Fetch a single listing details (Public).
    PUT/PATCH: Update your own listing (Protected - requires owner match).
    DELETE: Remove your own listing (Protected - requires owner match).
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner]


class MyListingsView(generics.ListAPIView):
    """GET: Fetch only the listings belonging to the logged-in user."""
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(owner=self.request.user).order_by('-created_at')
