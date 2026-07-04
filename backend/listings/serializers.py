from rest_framework import serializers
from .models import Listing, Category, ListingImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image']


class ListingSerializer(serializers.ModelSerializer):
    # Read-only fields to send human-readable context to the frontend
    owner_username = serializers.ReadOnlyField(source='owner.username')
    category_name = serializers.ReadOnlyField(source='category.name')
    images = ListingImageSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id',
            'owner',
            'owner_username',
            'category',
            'category_name',
            'title',
            'description',
            'price_per_day',
            'condition',
            'availability_status',
            'security_deposit',
            'available_from',
            'available_until',
            'location',
            'image',
            'images',
            'created_at'
        ]
        # Protect 'owner' so a malicious user can't spoof who is posting the listing
        read_only_fields = ['owner', 'created_at', 'availability_status']
