from rest_framework import serializers
from .models import Transaction
from listings.serializers import ListingSerializer


class TransactionSerializer(serializers.ModelSerializer):
    borrower_username = serializers.ReadOnlyField(source='borrower.username')
    owner_username = serializers.ReadOnlyField(source='owner.username')
    listing_details = ListingSerializer(source='listing', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id',
            'listing',
            'listing_details',
            'borrower',
            'borrower_username',
            'owner',
            'owner_username',
            'borrow_request',
            'start_date',
            'end_date',
            'price_per_day',
            'total_days',
            'total_amount',
            'status',
            'created_at'
        ]
        read_only_fields = [
            'borrower', 'owner', 'borrow_request', 'start_date',
            'end_date', 'price_per_day', 'total_days', 'total_amount', 'status'
        ]
