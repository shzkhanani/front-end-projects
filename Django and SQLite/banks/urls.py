from django.urls import path

from banks import views
from banks.views import Add, AddBranch, BankList, BankDetails, BranchDetails, EditBranch

urlpatterns = [
    path('add/', Add.as_view()),
    path('<int:bank_id>/branches/add/', AddBranch),
    path('all/', BankList.as_view()),
    path('<int:bank_id>/details/', BankDetails),
    path('branch/<int:branch_id>/details/', BranchDetails),
    path('branch/<int:branch_id>/edit/', EditBranch)
]
