from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q  # Added for complex queries
from config.permissions import IsOwner
from .models import Listing, Category, ListingImage
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
        exclude_owner = self.request.query_params.get('exclude_owner')

        from django.utils import timezone
        today = timezone.now().date()

        # Base filter: status must be AVAILABLE and fall inside the availability date range
        base_filter = Q(availability_status='AVAILABLE') & (
            Q(available_from__isnull=True) | Q(available_from__lte=today)
        ) & (
            Q(available_until__isnull=True) | Q(available_until__gte=today)
        )

        queryset = Listing.objects.filter(base_filter)

        if exclude_owner == 'true' and user.is_authenticated:
            queryset = queryset.exclude(owner=user)

        return queryset.order_by('-created_at')

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        return queryset

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the listing owner
        listing = serializer.save(owner=self.request.user)
        # Handle secondary images from request.FILES
        secondary_images = self.request.FILES.getlist('secondary_images')
        for img in secondary_images:
            ListingImage.objects.create(listing=listing, image=img)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Fetch a single listing details (Public).
    PUT/PATCH: Update your own listing (Protected - requires owner match).
    DELETE: Remove your own listing (Protected - requires owner match).
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner]

    def perform_update(self, serializer):
        listing = self.get_object()
        if listing.availability_status == 'RENTED':
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Rented listings cannot be edited.")
        
        listing = serializer.save()
        # Handle secondary images if provided on update
        if 'secondary_images' in self.request.FILES:
            listing.images.all().delete()
            secondary_images = self.request.FILES.getlist('secondary_images')
            for img in secondary_images:
                ListingImage.objects.create(listing=listing, image=img)

    def perform_destroy(self, instance):
        if instance.availability_status == 'RENTED':
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Rented listings cannot be deleted.")
        instance.delete()


class MyListingsView(generics.ListAPIView):
    """GET: Fetch only the AVAILABLE listings belonging to the logged-in user."""
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(
            owner=self.request.user, 
            availability_status__in=['AVAILABLE', 'INACTIVE']
        ).order_by('-created_at')
