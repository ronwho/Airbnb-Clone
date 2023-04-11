from django.contrib import admin
from .models import *

admin.site.register(UserReview)
admin.site.register(Properties)
admin.site.register(Reservations)
admin.site.register(PropertyReview)
admin.site.register(OwnerListing)
admin.site.register(Notifications)

