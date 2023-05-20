from django.urls import path
from .views import HotelListAPIView, HotelDetailAPIView, ReviewListCreateAPIView, KhaltiValidationView
from .views import get_validation_data

urlpatterns = [
    # Other URL patterns...
    path('', HotelListAPIView.as_view(), name='hotel-list'),
    path('subscribe/', KhaltiValidationView.as_view(), name='khalti-validation'),
    path('<slug:slug>/', HotelDetailAPIView.as_view(), name='hotel-detail'),
    path('<slug:hotel_slug>/reviews/', ReviewListCreateAPIView.as_view(), name='hotel-review-list'),
]


