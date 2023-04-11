from rest_framework.serializers import ModelSerializer
from restify.models import Properties, OwnerListing

class PropertiesSerializer(ModelSerializer):
    class Meta:
        model = Properties
        fields = ['name', 'description', 'address', 'country', 'city', 'state', 'postal_code', 'max_guests', 'amenities']

class OwnerLisitingSerializer(ModelSerializer):
    class Meta:
        model = OwnerListing
        exclude = ('property', 'owner')
