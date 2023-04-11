from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from django.contrib.auth.models import User
from .serializers import NotificationSerializer
from restify.models import Reservations, OwnerListing, Notifications, Properties
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination



# Create your views here.
class pagination(PageNumberPagination):
    page_size = 2

class NotificationsList(ListAPIView):
    serializer_class = NotificationSerializer 
    permission_classes = [IsAuthenticated]
    pagination_class = pagination
    
    def get_queryset(self):

        return Notifications.objects.filter(recieve_user=self.request.user)
    

class NotificationRead(UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        notification =  get_object_or_404(Notifications, id=self.kwargs['pk'])
        request_user = self.request.user
        recieve_user = notification.recieve_user

        if request_user!=recieve_user:
            self.permission_denied(self.request)

        return notification
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Notifications, id=self.kwargs['pk'])
        instance.read_status = "read"
        instance.save()
        return Response(serializer.data)

class NotificationClear(DestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        notification =  get_object_or_404(Notifications, id=self.kwargs['pk'])
        request_user = self.request.user
        recieve_user = notification.recieve_user

        if request_user!=recieve_user:
            self.permission_denied(self.request)

        return notification
    
    def perform_destroy(self, instance):
        instance = get_object_or_404(Notifications, id=self.kwargs['pk'])
        print(instance.read_status)
        if instance.read_status != 'read':
            raise ValidationError('You have not read the notification yet before clearing!')
        instance.delete() 