#import default user model
from django.contrib.auth.models import User
from django.db import models

class UserPicture(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='user_pictures')

class UserReview(models.Model):
    source_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='source_user')
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='target_user')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    stars = models.IntegerField(null=True, blank=True)

class Properties(models.Model):
    name = models.CharField(max_length=100, default='unnamed property')
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    max_guests = models.PositiveIntegerField()
    amenities = models.CharField(max_length=200)

class PropertyImage(models.Model):
    properties = models.ForeignKey(Properties, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')

class Reservations(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(Properties, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=100, choices=[ ('pending', 'pending'),
                                                        ('cancel_pending','cancel_pending'),
                                                        ('denied', 'denied'),
                                                        ('expired', 'expired'),
                                                        ('approved', 'approved'),
                                                        ('canceled', 'canceled'),
                                                        ('terminated', 'terminated'),
                                                        ('completed', 'completed')], default='pending')
    modified_date = models.DateTimeField(auto_now=True)
    num_of_guests = models.PositiveIntegerField()

class PropertyReview(models.Model):
    reservation = models.ForeignKey(Reservations, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    stars = models.IntegerField(null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    depth = models.IntegerField(default=0)

class OwnerListing(models.Model):
    property = models.ForeignKey(Properties, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    rate_per_day = models.PositiveIntegerField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class Notifications(models.Model):
    read_status = models.CharField(max_length=20, choices=[('unread','unread'),
                                                           ('read','read')], default='unread')
    message = models.CharField(max_length=100)
    recieve_user = models.ForeignKey(User,on_delete=models.CASCADE)
    reserveration = models.ForeignKey(Reservations, on_delete=models.CASCADE)
