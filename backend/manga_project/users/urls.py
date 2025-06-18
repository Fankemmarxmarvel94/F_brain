from django.urls import path
from .views import UserCreateView
from .views import CustomAuthToken

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
]
