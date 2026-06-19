from rest_framework import serializers
from .models import BorrowRequest
from listings.serializers import ListingSerializer


class BorrowRequestSerializer(serializers.ModelSerializer):
    borrower_username = serializers.ReadOnlyField(source='borrower.username')
    owner_username = serializers.ReadOnlyField(source='owner.username')
    listing_details = ListingSerializer(source='listing', read_only=True)

    class Meta:
        model = BorrowRequest
        fields = [
            'id', 'listing', 'listing_details', 'borrower', 'borrower_username',
            'owner', 'owner_username', 'message', 'start_date', 'end_date',
            'status', 'created_at'
        ]
        read_only_fields = ['borrower', 'owner', 'status', 'created_at']

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError(
                "End date must be after the start date.")
        
        request = self.context.get('request')
        if request and request.user:
            if data['listing'].owner == request.user:
                raise serializers.ValidationError(
                    "You cannot borrow your own listing."
                )
        
        if data['listing'].availability_status != 'AVAILABLE':
            raise serializers.ValidationError(
                "This listing is not currently available for borrowing."
            )
            
        return data
