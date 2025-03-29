from django.contrib import admin

from banks.models import Bank, Branch

admin.site.register(Bank),
admin.site.register(Branch)