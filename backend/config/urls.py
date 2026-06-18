from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView  # Add this import

urlpatterns = [
    path('admin/', admin.site.urls),

    # The JWT Token Endpoint
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Your Apps
    path('api/listings/', include('listings.urls')),
    path('api/requests/', include('borrow_requests.urls')),
    path('api/transactions/', include('transactions.urls')),
]
