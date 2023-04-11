from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import logoutView, signupView, ProfileView

APP_NAME = 'accounts'
urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logoutView.as_view(), name='logout'),
    path('signup/', signupView.as_view(), name='signup'),
    path('profile/', ProfileView.as_view(), name='profile'),
]