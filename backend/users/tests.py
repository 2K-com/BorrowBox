from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.profile_url = reverse('auth_profile')
        
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'StrongPassword123'
        }
        
    def test_user_registration(self):
        """Test user registration with valid data."""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'testuser@example.com')
        self.assertNotIn('password', response.data)
        
        # Test duplicate username registration
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        """Test user login returns access and refresh tokens."""
        # Register user first
        User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_profile_access_unauthenticated(self):
        """Test that profile access is forbidden if not authenticated."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_retrieval_and_update(self):
        """Test retrieving and updating user profile with JWT."""
        user = User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password=self.user_data['password']
        )
        
        # Authenticate using client credentials
        self.client.force_authenticate(user=user)
        
        # Retrieve Profile
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['full_name'], None) # Profile starts empty
        self.assertEqual(response.data['bio'], '') # Bio starts empty
        
        # Update Profile
        update_data = {
            'email': 'newemail@example.com',
            'full_name': 'Test User',
            'phone_number': '123-456-7890',
            'bio': 'My test bio'
        }
        response = self.client.put(self.profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'newemail@example.com')
        self.assertEqual(response.data['full_name'], 'Test User')
        self.assertEqual(response.data['phone_number'], '123-456-7890')
        self.assertEqual(response.data['bio'], 'My test bio')
        
        # Verify changes saved in User and Profile models
        user.refresh_from_db()
        self.assertEqual(user.email, 'newemail@example.com')
        self.assertEqual(user.profile.full_name, 'Test User')
        self.assertEqual(user.first_name, 'My test bio')
