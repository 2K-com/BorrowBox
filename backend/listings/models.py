from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Listing(models.Model):
    CONDITION_CHOICES = [
        ('NEW', 'New'),
        ('GOOD', 'Good'),
        ('USED', 'Used'),
    ]

    AVAILABILITY_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BORROWED', 'Borrowed'),
        ('INACTIVE', 'Inactive'),
    ]

    # Dynamic reference to your partner's user model
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='listings'
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_day = models.DecimalField(max_digits=8, decimal_places=2)
    security_deposit = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    condition = models.CharField(
        max_length=10, choices=CONDITION_CHOICES, default='GOOD')
    availability_status = models.CharField(
        max_length=15, choices=AVAILABILITY_CHOICES, default='AVAILABLE')
    location = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='listings/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.availability_status}"
