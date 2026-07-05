from django.db import models
from django.conf import settings
from listings.models import Listing
# FIX: plural folder name 'borrow_requests', singular model name 'BorrowRequest'
from borrow_requests.models import BorrowRequest


class Transaction(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('RETURN_PENDING', 'Return Pending'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    listing = models.ForeignKey(
        Listing, on_delete=models.PROTECT, related_name='transactions')
    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='borrowed_transactions')
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lent_transactions')

    # FIX: Point this field to the singular class name
    borrow_request = models.OneToOneField(
        BorrowRequest, on_delete=models.PROTECT, related_name='transaction')

    start_date = models.DateField()
    end_date = models.DateField()

    price_per_day = models.DecimalField(max_digits=8, decimal_places=2)
    total_days = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            self.total_days = max(delta.days, 1)
            self.total_amount = self.total_days * self.price_per_day
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Tx {self.id}: {self.listing.title} ({self.status})"


class Review(models.Model):
    transaction = models.ForeignKey(
        'Transaction', on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='reviews_given', on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='reviews_received', on_delete=models.CASCADE)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating} stars for {self.receiver}"
