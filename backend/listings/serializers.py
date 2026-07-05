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
        read_only_fields = ['owner', 'created_at']

    def validate(self, data):
        # 1. Date Range validation
        available_from = data.get('available_from')
        available_until = data.get('available_until')
        
        # If performing a partial update, fetch current values if not provided
        if self.instance:
            if 'available_from' not in data:
                available_from = self.instance.available_from
            if 'available_until' not in data:
                available_until = self.instance.available_until

        if available_from and available_until:
            if available_until < available_from:
                raise serializers.ValidationError({
                    "available_until": "Available Until date cannot be earlier than Available From date."
                })

        # 2. Status validation: Prevent setting RENTED manually
        availability_status = data.get('availability_status')
        if availability_status == 'RENTED':
            if not self.instance or self.instance.availability_status != 'RENTED':
                raise serializers.ValidationError({
                    "availability_status": "Currently Rented status is system-controlled and cannot be set manually."
                })

        return data
