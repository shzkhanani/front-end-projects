from django import forms
from django.core.validators import validate_email

from banks.models import Branch

# Reference : Lecture, https://docs.djangoproject.com/en/4.1/ref/forms/fields/

class EditBranchForm(forms.ModelForm):
    class Meta:
        model = Branch
        fields = ['name', 'transit_num', 'address', 'email', 'capacity']

    name = forms.CharField(label='name', max_length=110, required=True, error_messages={'required': 'This field is '
                                                                                                    'required'})
    transit_num = forms.CharField(label='transit_num', max_length=110, required=True,
                                  error_messages={'required': 'This field is '
                                                              'required'})
    address = forms.CharField(label='address', max_length=110, required=True,
                              error_messages={'required': 'This field is '
                                                          'required'})
    email = forms.EmailField(label='email', max_length=110, required=True,
                             error_messages={'required': 'This field is '
                                                         'required'})
    capacity = forms.IntegerField(label='capacity')

    # Reference for function in error : Lecture code
    def clean_name(self):
        data = super().clean()
        name = data.get('name')
        if len(name) > 100:
            self.add_error('name', f'Ensure this value has at most 100 characters (it has {len(name)} )')
        return name

    def clean_transit_num(self):
        data = super().clean()
        transit_num = data.get('transit_num')
        if len(transit_num) > 100:
            self.add_error('transit_num', f'Ensure this value has at most 100 characters (it has {len(transit_num)} )')
        return transit_num

    def clean_address(self):
        data = super().clean()
        address = data.get('address')
        if len(address) > 100:
            self.add_error('address', f'Ensure this value has at most 100 characters (it has {len(address)} )')
        return address

    # Reference for validate_email : https://stackoverflow.com/questions/3217682/checking-validity-of-email-in-django
    # -python

    def clean_email(self):
        data = super().clean()
        email = data.get('email')
        try:
            validate_email(email)
        except:
            self.add_error('email', 'Enter a valid email address')
        return email

    def clean_capacity(self):
        data = super().clean()
        capacity = data.get('capacity')
        if capacity < 0:
            self.add_error('capacity', 'Ensure this value is greater than or equal to 0')
        return capacity
