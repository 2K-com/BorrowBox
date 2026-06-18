from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    # Columns to display in the admin list view
    list_display = ('id', 'listing', 'borrower', 'owner',
                    'total_days', 'total_amount', 'status', 'created_at')

    # Adds a sidebar filter for these fields
    list_filter = ('status', 'created_at')

    # Adds a search bar that looks up related usernames and listing titles
    search_fields = ('borrower__username', 'owner__username', 'listing__title')

    # Makes the ID and listing title clickable to edit the record
    list_display_links = ('id', 'listing')
