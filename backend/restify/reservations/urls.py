from django.urls import path
from .views import *

APP_NAME = 'reservations'
urlpatterns = [
    path('reserve/', ReservationCreate.as_view(), name='create-reservation'),
    path('<int:pk>/cancel/',ReservationCancelRequest.as_view(),name='cancel-reservation'),
    path('list/', ReservationList.as_view(), name='list-reservation'),
    path('pending/<int:pk>/approve/', ReservationApprove.as_view(), name='approve-reservation'),
    path('pending/<int:pk>/deny/', ReservationDeny.as_view(), name='deny-reservation'),
    path('cancellations/<int:pk>/approve/', CancelApprove.as_view(), name='approve-cancellation'),
    path('cancellations/<int:pk>/deny/', CancelDeny.as_view(), name='deny-cancellation'),
    path('<int:pk>/terminate/', ReservationTerminate.as_view(), name='terminate-reservation'),
]
