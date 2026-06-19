from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from listings.models import Listing, Category
from borrow_requests.models import BorrowRequest


class BorrowRequestValidationTests(APITestCase):
    def setUp(self):
        # Create users
        self.owner = User.objects.create_user(
            username='owner_user',
            email='owner@example.com',
            password='Password123!'
        )
        self.borrower = User.objects.create_user(
            username='borrower_user',
            email='borrower@example.com',
            password='Password123!'
        )

        # Create category & listings
        self.category = Category.objects.create(name="Tools")
        
        # Available listing
        self.available_listing = Listing.objects.create(
            owner=self.owner,
            category=self.category,
            title="Drill",
            description="Cordless power drill",
            price_per_day=10.00,
            condition="GOOD",
            availability_status="AVAILABLE"
        )
        
        # Borrowed listing
        self.borrowed_listing = Listing.objects.create(
            owner=self.owner,
            category=self.category,
            title="Hammer",
            description="Claw hammer",
            price_per_day=2.00,
            condition="GOOD",
            availability_status="BORROWED"
        )

        self.request_create_url = reverse('request_create')

    def test_successful_borrow_request(self):
        """Verify borrower can successfully request an available listing they do not own."""
        self.client.force_authenticate(user=self.borrower)
        data = {
            "listing": self.available_listing.id,
            "start_date": "2026-08-01",
            "end_date": "2026-08-05",
            "message": "Let me borrow this please."
        }
        response = self.client.post(self.request_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BorrowRequest.objects.count(), 1)

    def test_prevent_self_borrowing(self):
        """Verify listing owners cannot borrow their own listings."""
        self.client.force_authenticate(user=self.owner)  # Authenticating as the owner
        data = {
            "listing": self.available_listing.id,
            "start_date": "2026-08-01",
            "end_date": "2026-08-05",
            "message": "Attempting self-borrowing"
        }
        response = self.client.post(self.request_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You cannot borrow your own listing.", response.data['non_field_errors'][0])

    def test_prevent_requesting_unavailable_listing(self):
        """Verify users cannot request a listing that is not currently AVAILABLE."""
        self.client.force_authenticate(user=self.borrower)
        data = {
            "listing": self.borrowed_listing.id,
            "start_date": "2026-08-01",
            "end_date": "2026-08-05",
            "message": "Attempting to request a borrowed listing"
        }
        response = self.client.post(self.request_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("This listing is not currently available for borrowing.", response.data['non_field_errors'][0])

    def test_prevent_duplicate_pending_requests(self):
        """Verify duplicate pending requests for the same listing by the same borrower are blocked, but allowed if status changes."""
        self.client.force_authenticate(user=self.borrower)
        data = {
            "listing": self.available_listing.id,
            "start_date": "2026-08-01",
            "end_date": "2026-08-05",
            "message": "First request."
        }
        
        # Create first request (should succeed, status=PENDING)
        response = self.client.post(self.request_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        first_request_id = response.data['id']
        
        # Try to create second request (should fail due to duplicate PENDING request)
        response2 = self.client.post(self.request_create_url, data)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You already have a pending borrow request for this listing.", response2.data['non_field_errors'][0])
        
        # Cancel the first request
        cancel_url = reverse('request_cancel', kwargs={'pk': first_request_id})
        response_cancel = self.client.patch(cancel_url)
        self.assertEqual(response_cancel.status_code, status.HTTP_200_OK)
        
        # Try to request again (should succeed since the previous is CANCELLED)
        response3 = self.client.post(self.request_create_url, data)
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)
