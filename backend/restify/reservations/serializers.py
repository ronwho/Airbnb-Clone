from rest_framework.serializers import ModelSerializer, CharField
from restify.models import Reservations 

class ReservationSerializer(ModelSerializer):
    class Meta:
        model = Reservations
        fields = ['num_of_guests','property','start_date','end_date']
        extra_kwargs = {
            'property':{'required':False},
            'start_date':{'required':False},
            'end_date':{'required':False},
            'num_of_guests':{'required':False}
        }

    def create(self, validated_data):
        # print(self.context['request'].user)
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
class ReservationSerializerList(ModelSerializer):
    class Meta:
        model = Reservations
        fields = ['id','user','num_of_guests','property','start_date','end_date','status','modified_date']
        extra_kwargs = {
            'property':{'required':False},
            'start_date':{'required':False},
            'end_date':{'required':False},
            'num_of_guests':{'required':False},
            'status':{'required':False},
            'modified_date':{'required':False},
            'id':{'required':False},
            'user':{'required':False}
        }

    def create(self, validated_data):
        # print(self.context['request'].user)
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)