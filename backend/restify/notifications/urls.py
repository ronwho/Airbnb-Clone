from django.urls import path
from .views import *

APP_NAME = 'notifications'
urlpatterns = [
    path('list/', NotificationsList.as_view(),name='list-notifications'),
    path('<int:pk>/read/',NotificationRead.as_view(),name='read-reservation'),
    path('<int:pk>/clear/',NotificationClear.as_view(),name='clear-reservation'),
    # path('reserve/', ReservationCreate.as_view(), name='create-reservation'),

]
