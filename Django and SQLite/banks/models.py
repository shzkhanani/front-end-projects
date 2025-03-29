from django.contrib.auth.models import User
from django.db import models


class Bank(models.Model):
    name = models.CharField(max_length=100, null=False)
    swift_code = models.CharField(max_length=100, null=False)
    inst_num = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=100, null=False)
    owner = models.ForeignKey(to=User, null=True, on_delete=models.SET_NULL, related_name='owner')

    def __str__(self):
        return self.name


class Branch(models.Model):
    name = models.CharField(max_length=100, null=False)
    transit_num = models.CharField(max_length=100, null=False)
    address = models.CharField(max_length=100, null=False)
    email = models.EmailField(default='admin@utoronto.ca')
    capacity = models.PositiveIntegerField(default= True)
    last_modified = models.DateTimeField(auto_now=True)
    bank = models.ForeignKey(to=Bank, null=True, on_delete=models.SET_NULL, related_name='branches')

    def __str__(self):
        return self.name
