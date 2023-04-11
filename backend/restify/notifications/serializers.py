from rest_framework.serializers import ModelSerializer, CharField
from restify.models import Notifications 

class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notifications 
        fields = ['read_status','message']
        extra_kwargs = {
            'read_status':{'required':False},
            'message':{'required':False},
        }
    