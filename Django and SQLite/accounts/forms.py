from urllib import request

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.validators import validate_email


# Reference : https://www.javatpoint.com/django-usercreationform and TA
class RegisterForm(UserCreationForm):
    username = forms.CharField(label='username', max_length=100, error_messages={})
    password1 = forms.CharField(label='password1', max_length=100, error_messages={})
    password2 = forms.CharField(label='password2', max_length=100, error_messages={})
    email = forms.EmailField(label='email', max_length=100)
    first_name = forms.CharField(label='first_name', max_length=100)
    last_name = forms.CharField(label='last_name', max_length=100)

    def clean_username(self):
        clean_data = super().clean()
        username = clean_data.get('username').lower()
        username_count = User.objects.filter(username=username)
        if username_count.count():
            self.add_error('username', 'A user with that username already exists')
        return username

    def clean_password1(self):
        clean_data = super().clean()
        password1 = clean_data.get('password1')
        password2 = clean_data.get('password2')
        if len(password1) < 8:
            self.add_error('password1', 'This password is too short. It must contain at least 8 characters')
        return password1

    def clean_password2(self):
        clean_data = super().clean()
        password1 = clean_data.get('password1')
        password2 = clean_data.get('password2')
        if password1 != password2:
            self.add_error('password2', "The two password fields didn't match")
        return password2

    def clean_email(self):
        clean_data = super().clean()
        email = clean_data.get('email').lower()
        try:
            validate_email(email)
        except:
            self.add_error('email', 'Enter a valid email address')
        return email

    def save(self):
        username = self.cleaned_data['username']
        password1 = self.cleaned_data['password1']
        email = self.cleaned_data['email']
        first_name = self.cleaned_data['first_name']
        last_name = self.cleaned_data['last_name']
        user = User.objects.create_user(username=username, password=password1, email=email, first_name=first_name,
                                        last_name=last_name)
        return user


# https://dev.to/earthcomfy/django-update-user-profile-33ho

class EditProfile(forms.ModelForm):
    first_name = forms.CharField(label='first_name', max_length=100)
    last_name = forms.CharField(label='last_name', max_length=100)
    email = forms.EmailField(label='email', max_length=100, error_messages={}, required=False)
    password1 = forms.CharField(label='password1', max_length=100, error_messages={}, required=False)
    password2 = forms.CharField(label='password2', max_length=100, error_messages={}, required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2']

    def clean_password(self):
        data = super().clean()
        password1 = data.get('password1')
        password2 = data.get('password2')
        if len(password1) < 8:
            self.add_error('password1', 'This password is too short. It must contain at least 8 characters')
        if password1 != password2:
            self.add_error('password2', "The two password fields didn't match")
        return password1

    # Reference for validate_email : https://stackoverflow.com/questions/3217682/checking-validity-of-email-in-django-python

    def clean_email(self):
        data = super().clean()
        email = data.get('email').lower()
        try:
            validate_email(email)
        except:
            self.add_error('email', 'Enter a valid email address')
        return email
