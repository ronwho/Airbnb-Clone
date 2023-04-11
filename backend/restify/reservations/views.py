from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from django.contrib.auth.models import User
from .serializers import ReservationSerializer, ReservationSerializerList
from restify.models import Reservations, OwnerListing, Notifications, Properties
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
import datetime
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

# Create your views here.

def expired_or_completed():
    now = datetime.datetime.now()

    # Expired reservation is when the modified date has passed 2 minutes and the status is pending
    passed_expire_date = now - datetime.timedelta(minutes=2)
    all_expired_reservations = Reservations.objects.filter(status='pending', modified_date__lte = passed_expire_date)
    
    # Completed reservations are where the current date is greater than the end date
    # (now >= end_date or end_date <= now) and the
    # reservation is approved
    all_completed_reservations = Reservations.objects.filter(status='approved', end_date__lte = now)

    if all_expired_reservations:
        for reserv in all_expired_reservations:
            print(reserv)
            reserv.status = 'expired'
            reserv.save()
            request_user = reserv.user
            property_owner = reserv.property.owner
            notification_for_requester = Notifications.objects.create(
                message = f"{property_owner} did not respond to your reservation request in time and the request has expired!",
                recieve_user = request_user,
                reserveration = reserv,
            )

            notification_for_host = Notifications.objects.create(
                message = f"{request_user}'s reservation request has expired due to no response",
                recieve_user = property_owner,
                reserveration = reserv,
            )
            

    if all_completed_reservations:
        for reserv in all_completed_reservations:
            reserv.status = 'completed'
            reserv.save()
            request_user = reserv.user
            property_owner = reserv.property.owner
            notification_for_requester = Notifications.objects.create(
                message = f"You've completed your stay at {property_owner}'s place!",
                recieve_user = request_user ,
                reserveration = reserv,
            )

            notification_for_host = Notifications.objects.create(
                message = f"{request_user} has completed their reservation at your place!",
                recieve_user = property_owner,
                reserveration = reserv,
            )

class pagination(PageNumberPagination):
    page_size = 6
class ReservationList(ListAPIView):
   serializer_class = ReservationSerializerList
   pagination_class = pagination
   permission_classes = [IsAuthenticated]
   
   def get_queryset(self):
        
        expired_or_completed()

        query_params = self.request.query_params


        if 'type' in query_params or 'status' in query_params or 'sort_by' in query_params:
            filtered_type_reservations = Reservations.objects.none()
            filtered_status_reservations = Reservations.objects.none()
            hasType = False
            hasStatus = False
            hasOrderBy = False
            if 'type' in query_params.keys():
                hasType = True
                user_type = query_params['type']
                # query_hosts = Properties.objects.order_by().values('owner').distinct()
                # all_hosts = list(query_hosts.values_list('owner',flat=True))
                # host_reservations = Reservations.objects.filter(user__in=all_hosts)
                # guest_reservations = Reservations.objects.exclude(user__in=all_hosts)
                properties_owned_by_user = Properties.objects.filter(owner=self.request.user) 
                host_reservations = Reservations.objects.filter(property__in=properties_owned_by_user)
                
                guest_reservations = Reservations.objects.filter(user=self.request.user)
                if user_type == 'host':
                    filtered_type_reservations = host_reservations
                elif user_type == 'guest':
                    filtered_type_reservations = guest_reservations
                else:
                    filtered_type_reservations = Reservations.objects.all()

            if 'status' in query_params.keys():
                hasStatus=True
                status_type = query_params['status']
                if status_type != 'all':
                    filtered_status_reservations = Reservations.objects.filter(status=status_type)
                else:
                    filtered_status_reservations = Reservations.objects.all()

            if 'sort_by' in query_params.keys():
                category = query_params['sort_by']
                if category == "none":
                    hasOrderBy = False
                else:
                    hasOrderBy = True

            if hasStatus & hasType:
                final_filtered_reservations = filtered_type_reservations.intersection(filtered_status_reservations)
                
                if hasOrderBy:
                    final_filtered_reservations = filtered_status_reservations.order_by(category)
                
                return final_filtered_reservations
            elif hasStatus and not hasType:
                if hasOrderBy:
                    filtered_status_reservations = filtered_status_reservations.order_by(category)
                return filtered_status_reservations
            elif hasType and not hasStatus:
                if hasOrderBy:
                    filtered_type_reservations = filtered_type_reservations.order_by(category)
                return filtered_type_reservations
            elif not hasType and not hasStatus:
                if hasOrderBy:
                    sorted_only = Reservations.objects.all().order_by(category)
                return sorted_only
            

        return Reservations.objects.all()

class ReservationCreate(CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self,serializer):
        # Gathering data
        expired_or_completed()
        body_data = serializer.validated_data
        keys = body_data.keys()
        if  'property' not in keys:
            raise ValidationError('Please fill in property ID')
        if 'num_of_guests' not in keys:
            raise ValidationError('Please fill in number of guests')
        if 'start_date' not in keys:
            raise ValidationError('Please fill in start date') 
        if  'end_date'  not in keys:
            raise ValidationError('Please fill in end date')

        property_obj = body_data['property']
        property_owner = property_obj.owner
        reservation_start_date = body_data['start_date']
        reservation_end_date = body_data['end_date']
        num_of_guests = body_data['num_of_guests']
        property_listing = OwnerListing.objects.filter(property = property_obj )
        request_user = self.request.user
        
        # Validation checks

        if num_of_guests > property_obj.max_guests or num_of_guests < 0:
            raise ValidationError("Error! Requested number of guests exceeds property's limit or is not a valid input!")

        # checking if reservation inputs are valid
        if reservation_start_date > reservation_end_date:
            raise ValidationError('Error! Requested reserveration start date cannot be later than property end date')
        if reservation_end_date < reservation_start_date:
            raise ValidationError('Error! Requested reservation end date cannot be earlier than property start date')

        # checking if property even has owner lisiting
        if not property_listing:
            raise ValidationError('Error! Owner has no listings on this property')

        # checking if requested dates match owner's listings
        request_date_in_listings = False
        for listing in property_listing:
            if reservation_start_date >= listing.start_date and reservation_end_date <= listing.end_date:
                request_date_in_listings = True
                break;
        if request_date_in_listings == False:
            raise ValidationError('Error! Requested start and end dates does not match any listing dates')
        
        # check if there is already a conflicting reservation
        # if request start date is 
        reservations_conflicts = Reservations.objects.filter(status='approved',start_date__lt= reservation_end_date,end_date__gt=reservation_start_date)
        if reservations_conflicts:
            raise ValidationError('Sorry, this reservation is already booked and approved!')
        
        new_reservation = serializer.save()
        print(new_reservation.modified_date)
        # creating a new notification
        new_notification = Notifications.objects.create(
            message = f"{request_user} wants to reserve your property and is waiting for your decision!",
            recieve_user = property_owner ,
            reserveration = new_reservation,
        )


class ReservationApprove(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        expired_or_completed()
        reservation =  get_object_or_404(Reservations, id=self.kwargs['pk'])
        request_user = self.request.user
        property_owner = reservation.property.owner

        if request_user!=property_owner:
            self.permission_denied(self.request)

        return reservation
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Reservations, id=self.kwargs['pk'])
        if instance.status not in ['approved','pending','expired']:
            raise ValidationError('Error! Status of reservation should not be approved at this point')
        instance.status = "approved"
        instance.save()
        property_obj = instance.property 
        # creating a new notification to approve requester that request has been approved
        new_notification = Notifications.objects.create(
            message = f"{property_obj.owner} has approved your reservation request!",
            recieve_user =  instance.user,
            reserveration = instance,
        )

        return Response(serializer.data)

class ReservationDeny(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        expired_or_completed()
        reservation =  get_object_or_404(Reservations, id=self.kwargs['pk'])
        request_user = self.request.user
        property_owner = reservation.property.owner

        if request_user!=property_owner:
            self.permission_denied(self.request)

        return reservation
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Reservations, id=self.kwargs['pk'])
        if instance.status not in ['denied','pending','expired']:
            raise ValidationError('Error! Status of reservation should not be denied at this point')
        instance.status = "denied"
        instance.save()

        property_obj = instance.property 

        # creating a new notification to approve requester that request has been denied
        new_notification = Notifications.objects.create(
            message = f"{property_obj.owner} has declined your reservation request!",
            recieve_user =  instance.user,
            reserveration = instance,
        )

        return Response(serializer.data)
    
class ReservationCancelRequest(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        expired_or_completed()
        reservation =  get_object_or_404(Reservations, id=self.kwargs['pk'])
        request_user = self.request.user
        reservation_owner = reservation.user

        if request_user!=reservation_owner:
            self.permission_denied(self.request)

        return reservation
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Reservations, id=self.kwargs['pk'])
        if instance.status not in ['approved']:
            raise ValidationError('Error! You cannot cancel at this point')
        instance.status = "cancel_pending"
        instance.save()

        property_obj = instance.property 

        new_notification = Notifications.objects.create(
            message = f"{instance.user} wants to cancel a reservation under your property!",
            recieve_user =  property_obj.owner,
            reserveration = instance,
        )


        return Response(serializer.data)
    
class CancelApprove(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        expired_or_completed()
        reservation =  get_object_or_404(Reservations, id=self.kwargs['pk'])
        request_user = self.request.user
        property_owner = reservation.property.owner

        # if request_user!=property_owner:
        #     self.permission_denied(self.request)

        return reservation
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Reservations, id=self.kwargs['pk'])
        past_status = instance.status
        if instance.status not in ['cancel_pending','pending']:
            raise ValidationError('Error! Only applies to cancellations and pending reservations')
        instance.status = "canceled"
        instance.save()

        property_obj = instance.property 
        if past_status == 'cancel_pending':
            new_notification = Notifications.objects.create(
                message = f"{property_obj.owner} has approved your cancellation request!",
                recieve_user =  instance.user,
                reserveration = instance,
            )
        if past_status == 'pending':
            new_notification = Notifications.objects.create(
                message = f"You have cancelled your reservation request!",
                recieve_user =  self.request.user,
                reserveration = instance,
            )
        


        return Response(serializer.data)

class CancelDeny(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        expired_or_completed()
        reservation =  get_object_or_404(Reservations, id=self.kwargs['pk'])
        request_user = self.request.user
        property_owner = reservation.property.owner

        if request_user!=property_owner:
            self.permission_denied(self.request)

        return reservation
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Reservations, id=self.kwargs['pk'])
        if instance.status not in ['cancel_pending']:
            raise ValidationError('Error! Only applies to cancellations')
        instance.status = "approved"
        instance.save()

        property_obj = instance.property 

        new_notification = Notifications.objects.create(
            message = f"{property_obj.owner} has denied your cancellation request!",
            recieve_user =  instance.user,
            reserveration = instance,
        )

        return Response(serializer.data)
    
class ReservationTerminate(UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        expired_or_completed()
        reservation =  get_object_or_404(Reservations, id=self.kwargs['pk'])
        request_user = self.request.user
        property_owner = reservation.property.owner

        if request_user!=property_owner:
            self.permission_denied(self.request)

        return reservation
    
    def perform_update(self, serializer):
        instance = get_object_or_404(Reservations, id=self.kwargs['pk'])
        if instance.status not in ['approved']:
            raise ValidationError('Error! Only applies to already approved reservations!')
        instance.status = "terminated"
        instance.save()

        property_obj = instance.property

        new_notification = Notifications.objects.create(
            message = f"{property_obj.owner} has terminated your reservation!",
            recieve_user =  instance.user,
            reserveration = instance,
        )

        return Response(serializer.data) 
