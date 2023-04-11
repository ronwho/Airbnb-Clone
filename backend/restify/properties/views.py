from django.shortcuts import get_object_or_404
from restify.models import OwnerListing, Properties, PropertyImage
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from properties.serializers import OwnerLisitingSerializer, PropertiesSerializer
from django.core.paginator import Paginator
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

def check_valid_date(date_str):
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

class CreateProperty(CreateAPIView):
    serializer_class = PropertiesSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):       
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        body_data = serializer.validated_data
        keys = body_data.keys()
        
        for field in ['name', 'description', 'address', 'city', 'state', 'country', 'postal_code', 'max_guests']:
            if field not in keys:
                print("caught")
                return JsonResponse({'error': f'Missing {field}'}, status=400)
            if field == 'max_guests' and body_data['max_guests'] < 1:
                return JsonResponse({'error': f'Max guests must be at least 1'}, status=400)

        if body_data['amenities'][-1] != ',':
            return JsonResponse({'error': f'Amenities must end with comma'}, status=400)

        body_data['owner'] = self.request.user

        images = self.request.FILES.getlist('images', [])
        if not images:
            return JsonResponse({'error': f'At least 1 image is required'}, status=400)
        property = serializer.save()
        print(self.request.data)
        for image in images:
            PropertyImage.objects.create(properties=property, image=image)

        headers = self.get_success_headers(serializer.data)
        images = PropertyImage.objects.filter(properties=property)
        image_set = []
        for image in images:
            image_set.append(str(image.image))
        return Response({'id': property.id, **serializer.data, "images": image_set}, status=status.HTTP_201_CREATED, headers=headers)

    
class UpdateProperty(RetrieveUpdateAPIView):
    serializer_class = PropertiesSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        property = self.get_object()
        serializer = self.get_serializer(property)
        images = PropertyImage.objects.filter(properties=property)
        image_set = []
        for image in images:
            print(type(image.image.url))
            image_set.append(image.image.url)            
        return Response({'id': property.id, **serializer.data, "images": image_set, "owner_id": property.owner.id})

    def get_object(self):        
        property = get_object_or_404(Properties, id=self.kwargs['pk'])
        request_user = self.request.user
        #if request_user != property.owner:
            #self.permission_denied(self.request)
        return property
    """
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        data['owner_id'] = instance.owner.id
        return Response(data)
    """
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if self.request.user != self.get_object().owner:
            self.permission_denied(self.request)
        return self.get(request, *args, **kwargs)

    def perform_update(self, serializer):
        body_data = serializer.validated_data
        keys = body_data.keys()
        for field in ['address', 'city', 'state', 'country', 'postal_code', 'max_guests', 'amenities']:
            if field in keys and type(body_data[field]) == str and len(body_data[field]) <= 0:
                raise ValidationError({f'{field}': 'Field needs to be non-empty'}, status=400)
            if field in keys and type(body_data[field]) == int and body_data[field] < 1:
                raise ValidationError({f'{field}': 'Field needs to be non-negative (atleast 1 person)'})

        if 'amenities' in keys and body_data['amenities'][-1] != ',':
            raise ValidationError({"amenities": "Must end with a comma"})
        property = serializer.save()

        images = self.request.FILES.getlist('update_images', [])
        if images:
            for image in images:
                PropertyImage.objects.create(properties=property, image=image)
        delete_image_url = self.request.data.get('delete_images', "")
        print ("delete_image: ", delete_image_url)
        if delete_image_url != "":
            for entry in PropertyImage.objects.filter(properties=property):
                image_url = entry.image.url                
                if delete_image_url == image_url:
                    entry.delete()
        return property

class DeleteProperty(DestroyAPIView):
    serializer_class = PropertiesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        property = get_object_or_404(Properties, id=self.kwargs['pk'])
        request_user = self.request.user
        if request_user != property.owner:
            self.permission_denied(self.request)
        return property

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        id = instance.id
        self.perform_destroy(instance)
        return Response(f'Property #{id} was deleted', status=status.HTTP_204_NO_CONTENT)

class CreateListing(CreateAPIView):
    serializer_class = OwnerLisitingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'id': listing.id, **serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        property = get_object_or_404(Properties, id=self.kwargs['pk'])
        if property.owner != self.request.user:
            self.permission_denied(self.request)

        body_data = serializer.validated_data
        keys = body_data.keys()
        for field in ['rate_per_day', 'start_date', 'end_date']:
            if field in keys and type(body_data[field]) == str and len(body_data[field]) <= 0:
                raise ValidationError({f'{field}': 'Field needs to be non-empty'}, status=400)
            if field in keys and type(body_data[field]) == int and body_data[field] < 0:
                raise ValidationError({f'{field}': 'Field needs to be Postive'})
        if 'start_date' in keys and 'end_date' in keys and not body_data['start_date'] <= body_data['end_date']:
            raise ValidationError('Start date must be before end date')
        return serializer.save(owner=self.request.user, property=property)

class UpdateListing(RetrieveUpdateAPIView):
    serializer_class = OwnerLisitingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        property = get_object_or_404(Properties, id=self.kwargs['pk'])
        listing = get_object_or_404(OwnerListing, id=self.kwargs['lk'])
        request_user = self.request.user
        if request_user != listing.owner or listing.owner != property.owner:
            self.permission_denied(self.request)
        return listing

    def perform_update(self, serializer):
        listing = self.get_object()
        body_data = serializer.validated_data
        keys = body_data.keys()
        for field in ['start_date', 'end_date', 'rate_per_day']:
            if field in keys and type(body_data[field]) == str and len(body_data[field]) <= 0:
                raise ValidationError({f'{field}': 'Field needs to be non-empty'}, status=400)
            if field in keys and type(body_data[field]) == int and body_data[field] < 0:
                raise ValidationError({f'{field}': 'Field needs to be non-negative'})

        if 'start_date' in keys and 'end_date' in keys and not body_data['start_date'] <= body_data['end_date']:
            raise ValidationError('Start date must be before end date')
        if 'start_date' in keys and not 'end_date' in keys and not body_data['start_date'] <= listing.end_date:
            raise ValidationError('New start date must end before current listing end date')
        if 'end_date' in keys and not 'start_date' in keys and not body_data['end_date'] >= listing.start_date:
            raise ValidationError('New end date must start after current listing start date')

        return super().perform_update(serializer)

class DeleteListing(DestroyAPIView):
    serializer_class = OwnerLisitingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        property = get_object_or_404(Properties, id=self.kwargs['pk'])
        listing = get_object_or_404(OwnerListing, id=self.kwargs['lk'])
        request_user = self.request.user
        if request_user != listing.owner or listing.owner != property.owner:
            self.permission_denied(self.request)
        return property, listing

    def destroy(self, request, *args, **kwargs):
        property, listing = self.get_object()
        property_id = property.id
        listing_id = listing.id
        self.perform_destroy(listing)
        return Response(f'Property #{property_id}, Listing #{listing_id} was deleted', status=status.HTTP_204_NO_CONTENT)

class SearchListings(APIView):

    def get(self, request):
        data = request.GET
        listings = OwnerListing.objects.all()

        for field in ['property_id',
                      'start_date',
                      'end_date',
                      'rate_per_day',
                      'address',
                      'city',
                      'state',
                      'postal_code',
                      'country',
                      'max_guests',
                      'amenities']:
            if field in data and type(data[field]) == str and len(data[field]) <= 0:
                raise ValidationError({f'{field}': 'Field needs to be non-empty'})

        if 'property_id' in data:
            listings = listings.filter(property__id=data['property_id'])    
            print("listings after property id", listings)       
        if 'start_date' in data:
            if not check_valid_date(data['start_date']):
                raise ValidationError("Start Date is invalid")
            if 'date_inclusive' in data and data['date_inclusive'] == 'true':
                listings = listings.filter(start_date__lte=data['start_date'])
            else:
                listings = listings.filter(start_date__gte=data['start_date'])  
            print("listings after start date", listings)      
        if 'end_date' in data:
            if not check_valid_date(data['end_date']):
                raise ValidationError("End Date is invalid")
            if 'date_inclusive' in data and data['date_inclusive'] == 'true':
                listings = listings.filter(end_date__gte=data['end_date'])
            else:
                listings = listings.filter(end_date__lte=data['end_date'])
            print("listings after end date", listings)
        if 'rate_per_day' in data:
            if int(data['rate_per_day']) < 1:
                raise ValidationError({"rate_per_day": "rate_per_day is invalid, must be larger than 0"})
            listings = listings.filter(rate_per_day__lte=data['rate_per_day'])
        if 'address' in data:
            listings = listings.filter(property__address__icontains=data['address'])
        if 'city' in data:
            listings = listings.filter(property__city__icontains=data['city'])
        if 'state' in data:
            listings = listings.filter(property__state__icontains=data['state'])
        if 'postal_code' in data:
            listings = listings.filter(property__postal_code__icontains=data['postal_code'])
        if 'country' in data:
            listings = listings.filter(property__country__icontains=data['country'])
        if 'max_guests' in data:
            if int(data['max_guests']) < 1:
                raise ValidationError({"max_guests": "max_guests is invalid, must be larger than 0"})
            listings = listings.filter(property__max_guests__lte=data['max_guests'])
        if 'order_by' in data and data['order_by'] == 'max_guests':
            listings = listings.order_by('property__max_guests')
        if 'order_by' in data and data['order_by'] == 'rate_per_day':
            listings = listings.order_by('rate_per_day')

        if 'amenities' in data:
            listings = listings.filter(property__amenities__icontains=data['amenities'])


        search_instance = []
        for each in listings:
            search_instance.append({
                'property_id': each.property.id,
                'address': each.property.address,
                'city': each.property.city,
                'state': each.property.state,
                'postal_code': each.property.postal_code,
                'country': each.property.country,
                'max_guests': each.property.max_guests,
                'amenities': each.property.amenities,
                'listing_id': each.id,
                'start_date': each.start_date.strftime("%Y-%m-%d"),
                'end_date': each.end_date.strftime("%Y-%m-%d"),
                'rate_per_day': each.rate_per_day,
            })
        paginator = Paginator(search_instance, 2)
        print(data)
        page_obj = paginator.get_page(data['page'])
        return JsonResponse({
            'listings': list(page_obj),
            'page': page_obj.number,
            'pages': paginator.num_pages
        })
