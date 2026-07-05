import datetime
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from listings.models import Listing, Category
from borrow_requests.models import BorrowRequest
from transactions.models import Transaction
from notifications.models import Notification


class NotificationsAndDashboardTests(APITestCase):
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

        # Create category & listing
        self.category = Category.objects.create(name="Electronics")
        self.listing = Listing.objects.create(
            owner=self.owner,
            category=self.category,
            title="Projector",
            description="High definition projector",
            price_per_day=15.00,
            condition="GOOD",
            availability_status="AVAILABLE"
        )

        # URLs
        self.request_create_url = reverse('request_create')
        self.notifications_list_url = reverse('notification_list')
        self.unread_count_url = reverse('notification_unread_count')
        self.dashboard_url = reverse('dashboard')

    def test_notification_creation_on_borrow_request_lifecycle(self):
        """
        Tests that:
        1. Creating a borrow request notifies the listing owner.
        2. Accepting the borrow request notifies the borrower.
        3. Rejecting the request notifies the borrower.
        """
        # --- 1. Creation ---
        self.client.force_authenticate(user=self.borrower)
        request_data = {
            "listing": self.listing.id,
            "message": "Need it for a presentation.",
            "start_date": "2026-07-01",
            "end_date": "2026-07-03"
        }
        response = self.client.post(self.request_create_url, request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify owner has 1 notification of type REQUEST_RECEIVED
        owner_notification = Notification.objects.filter(user=self.owner).first()
        self.assertIsNotNone(owner_notification)
        self.assertEqual(owner_notification.type, "REQUEST_RECEIVED")
        self.assertEqual(owner_notification.title, "New Borrow Request")
        self.assertIn("borrower_user", owner_notification.message)

        # Retrieve request id
        request_id = response.data['id']

        # --- 2. Reject ---
        # First we test reject flow (we will create another request for accept)
        self.client.force_authenticate(user=self.owner)
        reject_url = reverse('request_reject', kwargs={'pk': request_id})
        response = self.client.patch(reject_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify borrower received REQUEST_REJECTED notification
        borrower_notification = Notification.objects.filter(user=self.borrower, type="REQUEST_REJECTED").first()
        self.assertIsNotNone(borrower_notification)
        self.assertEqual(borrower_notification.title, "Request Rejected")
        self.assertEqual(borrower_notification.message, "Your borrow request has been rejected.")

        # --- 3. Accept ---
        # Reset listing status so we can create another request
        self.listing.availability_status = "AVAILABLE"
        self.listing.save()

        self.client.force_authenticate(user=self.borrower)
        response = self.client.post(self.request_create_url, request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_request_id = response.data['id']

        self.client.force_authenticate(user=self.owner)
        accept_url = reverse('request_accept', kwargs={'pk': new_request_id})
        response = self.client.patch(accept_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify borrower received REQUEST_ACCEPTED notification
        borrower_accept_notif = Notification.objects.filter(user=self.borrower, type="REQUEST_ACCEPTED").first()
        self.assertIsNotNone(borrower_accept_notif)
        self.assertEqual(borrower_accept_notif.title, "Request Accepted")
        self.assertEqual(borrower_accept_notif.message, "Your borrow request has been accepted.")

    def test_notification_endpoints(self):
        """
        Tests notifications list, marking read, and unread counts.
        """
        # Create some notifications manually
        Notification.objects.create(
            user=self.borrower,
            title="System Alert 1",
            message="Alert 1 message",
            type="SYSTEM",
            is_read=False
        )
        notif_2 = Notification.objects.create(
            user=self.borrower,
            title="System Alert 2",
            message="Alert 2 message",
            type="SYSTEM",
            is_read=False
        )

        self.client.force_authenticate(user=self.borrower)

        # Test list endpoint
        response = self.client.get(self.notifications_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        # Test unread count endpoint (should be 2)
        response = self.client.get(self.unread_count_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

        # Test mark read endpoint
        read_url = reverse('notification_read', kwargs={'pk': notif_2.id})
        response = self.client.patch(read_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_read'])

        # Verify count decreased to 1
        response = self.client.get(self.unread_count_url)
        self.assertEqual(response.data['count'], 1)

        # Test security: owner trying to read borrower's notification
        self.client.force_authenticate(user=self.owner)
        response = self.client.patch(read_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_endpoint(self):
        """
        Tests the dashboard calculation returns accurate statistics.
        """
        # Register a listing for borrower so borrower total_listings = 1
        Listing.objects.create(
            owner=self.borrower,
            category=self.category,
            title="Listing B",
            description="Item B description",
            price_per_day=5.00,
            condition="NEW",
            availability_status="AVAILABLE"
        )

        # Create 1 incoming request for borrower from owner (pending_requests = 1)
        borrow_req_b = BorrowRequest.objects.create(
            listing=Listing.objects.filter(owner=self.borrower).first(),
            borrower=self.owner,
            owner=self.borrower,
            start_date=datetime.date(2026, 7, 1),
            end_date=datetime.date(2026, 7, 3),
            status="PENDING"
        )

        # Create active borrowing (active_borrowings = 1 where borrower=borrower)
        active_listing = Listing.objects.create(
            owner=self.owner,
            category=self.category,
            title="Listing C",
            price_per_day=1.00,
            availability_status="RENTED"
        )
        active_req = BorrowRequest.objects.create(
            listing=active_listing,
            borrower=self.borrower,
            owner=self.owner,
            start_date=datetime.date(2026, 7, 1),
            end_date=datetime.date(2026, 7, 3),
            status="ACCEPTED"
        )
        Transaction.objects.create(
            listing=active_listing,
            borrower=self.borrower,
            owner=self.owner,
            borrow_request=active_req,
            start_date=datetime.date(2026, 7, 1),
            end_date=datetime.date(2026, 7, 3),
            price_per_day=1.00,
            total_days=2,
            total_amount=2.00,
            status="ACTIVE"
        )

        # Create completed transaction (completed_transactions = 1 where borrower=borrower)
        completed_listing = Listing.objects.create(
            owner=self.owner,
            category=self.category,
            title="Listing D",
            price_per_day=2.00,
            availability_status="AVAILABLE"
        )
        completed_req = BorrowRequest.objects.create(
            listing=completed_listing,
            borrower=self.borrower,
            owner=self.owner,
            start_date=datetime.date(2026, 6, 1),
            end_date=datetime.date(2026, 6, 3),
            status="ACCEPTED"
        )
        Transaction.objects.create(
            listing=completed_listing,
            borrower=self.borrower,
            owner=self.owner,
            borrow_request=completed_req,
            start_date=datetime.date(2026, 6, 1),
            end_date=datetime.date(2026, 6, 3),
            price_per_day=2.00,
            total_days=2,
            total_amount=4.00,
            status="COMPLETED"
        )

        # Create unread notifications for borrower = 3
        Notification.objects.create(user=self.borrower, title="N1", message="M1", is_read=False)
        Notification.objects.create(user=self.borrower, title="N2", message="M2", is_read=False)
        Notification.objects.create(user=self.borrower, title="N3", message="M3", is_read=False)

        # Authenticate borrower
        self.client.force_authenticate(user=self.borrower)
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data["total_listings"], 1)
        self.assertEqual(response.data["pending_requests"], 1)
        self.assertEqual(response.data["active_borrowings"], 1)
        self.assertEqual(response.data["completed_transactions"], 1)
        self.assertEqual(response.data["unread_notifications"], 3)
