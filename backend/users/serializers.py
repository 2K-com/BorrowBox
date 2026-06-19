from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='profile.full_name', required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(source='profile.phone_number', required=False, allow_blank=True, allow_null=True)
    profile_picture = serializers.ImageField(source='profile.profile_picture', required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'phone_number', 'profile_picture']
        read_only_fields = ['username']

    def update(self, instance, validated_data):
        # Extract profile nested data
        profile_data = validated_data.pop('profile', {})
        
        # Update User fields
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update Profile fields
        profile = instance.profile
        profile.full_name = profile_data.get('full_name', profile.full_name)
        profile.phone_number = profile_data.get('phone_number', profile.phone_number)
        
        # Handle profile picture update/clear
        if 'profile_picture' in profile_data:
            profile.profile_picture = profile_data['profile_picture']
            
        profile.save()

        return instance
