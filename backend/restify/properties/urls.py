from django.urls import path
from .views import *

APP_NAME = 'properties'
urlpatterns = [
    path('create/', CreateProperty.as_view(), name='create_property'),
    path('<int:pk>/update/', UpdateProperty.as_view(), name='update_property'),
    path('<int:pk>/delete/', DeleteProperty.as_view(), name='delete_property'),
    path('<int:pk>/listing/create/', CreateListing.as_view(), name="create_owner_listing"),
    path('<int:pk>/listing/<int:lk>/update/', UpdateListing.as_view(), name="update_owner_listing"),
    path('<int:pk>/listing/<int:lk>/delete/', DeleteListing.as_view(), name="delete_owner_listing"),
    path('listings/search/', SearchListings.as_view(), name='all_property_listings'),
]
