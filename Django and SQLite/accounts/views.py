from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect, HttpResponseNotAllowed, JsonResponse
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic import FormView

import accounts
from accounts.forms import RegisterForm, EditProfile

# Reference : Lecture week 03-05
class Register(FormView):
    template_name = 'accounts/sign_up.html'
    form_class = RegisterForm

    def get(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        return TemplateResponse(request, 'accounts/sign_up.html')

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/accounts/login/', status=302)
        else:
            return TemplateResponse(request, 'accounts/sign_up.html', {'form': form})


# Reference : Lecture week 05
class Login(View):
    template_name = 'accounts/login.html'

    def get(self, request, *args, **kwargs):
        return TemplateResponse(request, 'accounts/login.html')

    def post(self, request, *args, **kwargs):
        username_input = request.POST.get('username')
        password_input = request.POST.get('password')

        if user := authenticate(request, username=username_input, password=password_input):
            login(request, user)
            return HttpResponseRedirect('/accounts/profile/view/', status=302)
        else:
            authentication_error = "Username or password is invalid"
            return TemplateResponse(request, 'accounts/login.html', context={'errors': [authentication_error]})

# Reference : https://docs.djangoproject.com/en/4.1/topics/auth/default/

class Logout(View):
    template_name = 'accounts/logout.html'

    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect('/accounts/login/', status=302)


# Reference : https://docs.djangoproject.com/en/4.1/ref/contrib/auth/ and
# https://stackoverflow.com/questions/2428092/creating-a-json-response-using-django-and-python
class ProfileView(View):
    def get(self, request, *args, **kwargs):
        user_profile = request.user
        if user_profile.is_authenticated:
            json_data = {'id': user_profile.id, 'username': user_profile.username, 'email': user_profile.email,
                         'first_name': user_profile.first_name, 'last_name': user_profile.last_name}
            return JsonResponse(json_data)
        else:
            return HttpResponse('UNAUTHORIZED', status=401)


# Reference : https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Forms ,
# https://dev.to/earthcomfy/django-update-user-profile-33ho
class ProfileEdit(View):
    template_name = 'accounts/edit_profile.html'
    form_class = EditProfile

    def get(self, request, *args, **kwargs):
        user_profile = request.user
        form = self.form_class(initial={'first_name': user_profile.first_name, 'last_name': user_profile.last_name,
                                        'email': user_profile.email})
        return TemplateResponse(request, 'accounts/edit_profile.html', {'form': form})

    def post(self, request, *args, **kwargs):
        user = request.user
        form = self.form_class(request.POST, instance=user)
        if form.is_valid():
            if form.cleaned_data['password1'] and form.cleaned_data['password2']:
                user.set_password(form.cleaned_data['password1'])
                form.save()
                # Lecture code - this portion authenticates the user with a new password so that the user
                # is logged back in and a new password is saved
                user_updated = authenticate(request, username=user.username, password=form.cleaned_data['password1'])
                login(request, user_updated)
            else:
                form.save()
            return HttpResponseRedirect('/accounts/profile/view/', status=302)
        else:
            return TemplateResponse(request, 'accounts/edit_profile.html', {'form': form})
