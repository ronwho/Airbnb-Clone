from django.http import JsonResponse
from restify.models import UserReview, Properties, Reservations, PropertyReview
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.core import serializers

def check_required_fields(data, required_fields):    
    for field in required_fields:
        if field not in data:
            return JsonResponse({'error': f'Missing field {field}'}, status=400)        
    return True
        
def propertyReviewToJson(review):
    #find out the user who made the comment
    if review.depth % 2 == 1:
        user = review.reservation.user        
    elif review.depth % 2 == 0:       
        user = review.reservation.property.owner 
        
    return {
        'id': review.id,
        'reservation_id': review.reservation.id if review.reservation else None,
        'message': review.message,
        'created_at': review.created_at,
        'stars': review.stars if review.stars else None,
        'parent_id': review.parent.id if review.parent else None,
        'depth': review.depth,
        'user_id': user.id
    }

class LastUncommentedReservation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_id = request.GET.get('property_id')
        #order completed or terminated reservations by end date
        reservations = Reservations.objects.filter(property_id=property_id).filter(status='completed').order_by('-end_date') | Reservations.objects.filter(property_id=property_id).filter(status='terminated').order_by('-end_date')
        for reservation in reservations:
            if not PropertyReview.objects.filter(reservation=reservation).exists():
                return JsonResponse({
                    'reservation_id': reservation.id,
                    'start_date': reservation.start_date,
                    'end_date': reservation.end_date,
                })
        return JsonResponse({'error': 'No reservations found'}, status=404)

class PropertyReviewView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):        
        data = request.GET        
        if 'property_id' in data:            
            reservations = Reservations.objects.filter(property_id=data['property_id'])

            property_reviews = PropertyReview.objects.filter(reservation__in=reservations)
            average_rating = 0
            for review in property_reviews:
                if review.stars != None:
                    average_rating += review.stars
            if property_reviews.count() > 0:
                average_rating = average_rating / property_reviews.count()

        elif 'reservation_id' in data:
            property_reviews = PropertyReview.objects.filter(reservation_id=data['reservation_id'])            

        elif 'parent_id' in data:           
            property_reviews = PropertyReview.objects.filter(parent=data['parent_id'])

        else:
            property_reviews = PropertyReview.objects.all()

        if 'depth' in data:
            property_reviews = property_reviews.filter(depth=data['depth'])

        #sort reviews by date
        property_reviews = property_reviews.order_by('-created_at')
            
        check_result = check_required_fields(data, ['page'])
        if check_result != True:
            return check_result        
        
        paginator = Paginator(property_reviews, 5)
        page_obj = paginator.get_page(data['page'])

        reviews_json = []
        for review in page_obj:
            reviews_json.append(propertyReviewToJson(review))

        if 'property_id' in data:
            return JsonResponse({
                'reviews': reviews_json,
                'page': page_obj.number,
                'pages': paginator.num_pages,
                'average_rating': average_rating
            })

        return JsonResponse({
            'reviews': reviews_json,
            'page': page_obj.number,
            'pages': paginator.num_pages
        })
        
    def post(self, request):
        data = request.data
        print (data)

        #This is for creating the origional comment
        if 'reservation_id' in data:
            reservation = get_object_or_404(Reservations, id=data['reservation_id'])
            if reservation.user != request.user:
                return JsonResponse({'error': 'This is not your reservation'}, status=403)            
            if PropertyReview.objects.filter(reservation=reservation).exists():
                return JsonResponse({'error': 'You already reviewed this reservation'}, status=403)
            if reservation.status != 'completed' and reservation.status != 'terminated':                
                return JsonResponse({'error': 'Reservation must be completed or terminated before reviewing'}, status=403)
            
            check_result = check_required_fields(data, ['stars', 'message'])
            if check_result != True:
                return check_result
            
            #check if stars is between 1 and 5
            if int(data['stars']) < 1 or int(data['stars']) > 5:
                return JsonResponse({'error': 'Stars must be between 1 and 5'}, status=400)

            review = PropertyReview.objects.create(
                reservation=reservation,
                stars=data['stars'],
                message=data['message'],
                depth = 1,
            )
            review.save()

        #This is for creating a reply to a comment
        elif 'parent_id' in data:     
            check_result = check_required_fields(data, ['message'])   
            if check_result != True:
                return check_result    
            parent = get_object_or_404(PropertyReview, id=data['parent_id'])
            
            #This means the reply is created for the owner 
            if parent.depth % 2 == 1:
                #check if current user owns the property in the reservation                
                if parent.reservation.property.owner != request.user:
                    return JsonResponse({'error': 'You do not own this property'}, status=403)
                #check if the parent review already has a reply
                if PropertyReview.objects.filter(parent=parent).exists():
                    return JsonResponse({'error': 'You already replied to this comment'}, status=403)
                if not 'precheck' in data:                    
                    review = PropertyReview.objects.create(     
                        reservation=parent.reservation,               
                        parent=parent,                    
                        message=data['message'],
                        depth = parent.depth + 1,
                    )
                    
                    review.save()

            elif parent.depth % 2 == 0:
                #check if current user is the user who made the original comment
                if parent.parent.reservation.user != request.user:
                    return JsonResponse({'error': 'You did not make the origional comment'}, status=403)                
                #check if the parent review already has a reply
                if PropertyReview.objects.filter(parent=parent).exists():
                    return JsonResponse({'error': 'You already replied to this comment'}, status=403)
                if not 'precheck' in data:
                    review = PropertyReview.objects.create(    
                        reservation=parent.reservation,
                        parent=parent,                    
                        message=data['message'],
                        depth = parent.depth + 1,
                    )               
                    
                    review.save()
        else:
            return JsonResponse({'error': 'Missing field reservation_id or parent_id'}, status=400)           


        if 'precheck' in data:
            return JsonResponse({'message': 'Review can be created'})
        return JsonResponse({'message': 'Review created'})
    
class UserReviewView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        #check if current user owns at least one property
        if not Properties.objects.filter(owner=request.user).exists():
            return JsonResponse({'error': 'You do not own any properties'}, status=403)
        
        data = request.data

        check_result = check_required_fields(data, ['page'])
        if check_result != True:
            return check_result
        if 'target_user_id' in data:
            user_reviews = UserReview.objects.filter(target_user_id=data['target_user_id'])
        elif 'source_user_id' in data:
            if data['source_user_id'] == "self":
                user_reviews = UserReview.objects.filter(source_user_id=request.user.id)
            else:
                user_reviews = UserReview.objects.filter(source_user_id=data['source_user_id'])
        else:
            user_reviews = UserReview.objects.all()

        if not user_reviews.exists():
            return JsonResponse({'error': 'No reviews found'}, status=404)
        
        paginator = Paginator(user_reviews, 5)
        page_obj = paginator.get_page(data['page'])

        reviews_json = []
        for review in page_obj:
            reviews_json.append({
                'id': review.id,
                'target_user_id': review.target_user.id,
                'source_user_id': review.source_user.id,
                'message': review.message,
                'created_at': review.created_at,
                'stars': review.stars,
            })

        return JsonResponse({
            'reviews': reviews_json,
            'page': page_obj.number,
            'pages': paginator.num_pages
        })
    
    def post(self, request):
        data = request.data
        check_result = check_required_fields(data, ['target_user_id', 'stars', 'message'])        
        if check_result != True:
            return check_result
        
        if data['target_user_id'] == request.user.id:
            return JsonResponse({'error': 'You cannot review yourself'}, status=403)
        if UserReview.objects.filter(source_user_id=request.user.id, target_user_id=data['target_user_id']).exists():
            return JsonResponse({'error': 'You already reviewed this user'}, status=403)
        if not User.objects.filter(id=data['target_user_id']).exists():
            return JsonResponse({'error': 'User does not exist'}, status=404)
        

        if not Reservations.objects.filter(user_id=data['target_user_id'], property__owner=request.user, status='completed').exists():
            return JsonResponse({'error': 'You must have a completed reservation with this user to review'}, status=403)
        
        if int(data['stars']) < 1 or int(data['stars']) > 5:
                return JsonResponse({'error': 'Stars must be between 1 and 5'}, status=400)
        
        review = UserReview.objects.create(
            target_user_id=data['target_user_id'],
            source_user_id=request.user.id,
            stars=data['stars'],
            message=data['message']
        )
        review.save()
        return JsonResponse({'message': 'Review created'})

