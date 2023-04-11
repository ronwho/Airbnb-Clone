from django.urls import path
from .views import PropertyReviewView, UserReviewView, LastUncommentedReservation

APP_NAME = 'comments'
urlpatterns = [
    path('property_reviews/', PropertyReviewView.as_view(), name='property_reviews'),
    path('user_reviews/', UserReviewView.as_view(), name='user_reviews'),
    path('last_uncommented_reservation/',  LastUncommentedReservation.as_view(), name='last_uncommented_reservation'),
]