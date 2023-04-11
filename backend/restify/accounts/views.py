from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from restify.models import UserPicture
from rest_framework_simplejwt.tokens import RefreshToken

class logoutView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        response = JsonResponse({'message': 'Logged out'})
        response.delete_cookie('refresh_token')
        response.delete_cookie('access_token')
        return response

def check_required_fields(data, required_fields):    
    for field in required_fields:
        if field not in data:
            if field == "password2":
                return JsonResponse({'error':'Missing password confirmation'}, status=400)
            return JsonResponse({'error': f'Missing field {field}'}, status=400)        
    return True
        
def initialize_fields(data, fields):
    cpy = data.copy()
    for field in fields:
        if field not in cpy:
            cpy[field] = ""
    return cpy

class signupView(APIView):
    def post(self, request):
        data = request.data
        check_result = check_required_fields(data, ['username', 'password','password2'])
        if check_result != True:
            return check_result
        data = initialize_fields(data, ['first_name', 'last_name', 'email'])

        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        if len(data['password']) < 8:
            return JsonResponse({'error': 'Password must be at least 8 characters'}, status=400)
        
        if data['password'] != data['password2']:
            return JsonResponse({'error': 'Passwords are not matching. Please try again!'}, status=400)

        
        if data['email'] != "" and '@' not in data['email']:
            return JsonResponse({'error': 'Invalid email'}, status=400)

        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email']
        )
        user.save()

        return JsonResponse({'message': 'Signed up'})
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if 'user_id' in request.GET:
            user = User.objects.get(id=request.GET['user_id'])
        else:
            user = request.user
        profile_picture = UserPicture.objects.filter(user=user).first()
        response_dict = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        }
        if profile_picture:
            response_dict['picture_url'] = profile_picture.picture.url
        else:
            response_dict['picture_url'] = None
        return JsonResponse(response_dict)
    
    def post(self, request):
        user = request.user
        data = request.data


        if 'username' in data: 
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            user.username = data['username']       
        
        if 'password' in data:
            if len(data['password']) < 8:
                return JsonResponse({'error': 'Password must be at least 8 characters'}, status=400)
            if 'password2' not in data:
                return JsonResponse({'error': 'Please confirm your password'}, status=400)
            
            if data['password'] != data['password2']:
                return JsonResponse({'error': 'Passwords are not matching. Please try again!'}, status=400)
            
            user.set_password(data['password'])

        

        if 'email' in data:
            if data['email'] != "" and '@' not in data['email']:
                return JsonResponse({'error': 'Invalid email'}, status=400)
            user.email = data['email']

        if 'first_name' in data:
            user.first_name = data['first_name']

        if 'last_name' in data:
            user.last_name = data['last_name']

        if 'picture' in data:
            user_picture = UserPicture.objects.filter(user=user).first()
            if 'picture' in list(request.FILES.keys()):
                picture = request.FILES['picture']
                if user_picture:
                    user_picture.picture = picture
                    user_picture.save()
                else:
                    user_picture = UserPicture(user=user, picture=picture)
                    user_picture.save()
            else:
                user_picture.delete()

        user.save()

        return JsonResponse({'message': 'Profile updated'})