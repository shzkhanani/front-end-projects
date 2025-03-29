from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.views import View

from banks.Forms.edit_branch import EditBranchForm
from banks.Forms.newbank import AddBank
from banks.Forms.newbranch import AddBranchForm
from banks.models import Bank, Branch


# Reference for login required :
# https://docs.djangoproject.com/en/3.1/topics/auth/default/#the-login-required-decorator

class Add(LoginRequiredMixin, View):
    template_name = 'banks/add.html'
    form_class = AddBank

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse('UNAUTHORIZED', status=401)
        else:
            return TemplateResponse(request, 'banks/add.html')

    # Reference : https://docs.djangoproject.com/en/4.1/ref/models/instances/#django.db.models.Model.save
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse('UNAUTHORIZED', status=401)

        form = self.form_class(request.POST)
        if form.is_valid():
            b = Bank(name=form.cleaned_data['name'],
                     inst_num=form.cleaned_data['inst_num'], swift_code=form.cleaned_data['swift_code'],
                     description=form.cleaned_data['description'])
            b.owner = request.user
            b.save()
            return HttpResponseRedirect(f'/banks/{b.id}/details/', status=302)
        else:
            form = self.form_class(request.POST)
            return TemplateResponse(request, 'banks/add.html', {'form': form})


# Reference : Lecture week 6 and piazza
@login_required
def AddBranch(request, bank_id):
    bank = get_object_or_404(Bank, id=bank_id)
    if not request.user.is_authenticated:
        return HttpResponse('UNAUTHORIZED', status=401)
    if request.user != bank.owner:
        return HttpResponse('FORBIDDEN', status=403)
    if request.method == 'GET':
        form = AddBranchForm(request.POST)
        return TemplateResponse(request, 'banks/addBranch.html', {'form': AddBranchForm(), 'bank': bank_id})

    if request.method == 'POST':
        form = AddBranchForm(request.POST)
        if form.is_valid():
            new_branch = Branch(name=form.cleaned_data['name'], transit_num=form.cleaned_data['transit_num'],
                                address=form.cleaned_data['address'], email=form.cleaned_data['email'],
                                capacity=form.cleaned_data['capacity'], bank=bank)
            new_branch.save()
            return HttpResponseRedirect(f'/banks/branch/{new_branch.id}/details/', status=302)
        else:
            return TemplateResponse(request, 'banks/addBranch.html', {'form': form, 'bank': bank_id})


class BankList(View):
    def get(self, request, *args, **kwargs):
        all_banks = Bank.objects.all()
        return TemplateResponse(request, 'banks/display_banks.html', {'banks': all_banks})


def BankDetails(request, bank_id):
    if request.method == "GET":
        bank = get_object_or_404(Bank, id=bank_id)
        branches = Branch.objects.filter(bank=bank)
        return TemplateResponse(request, 'banks/bank_information.html', {'bank': bank, 'branches': branches})


@login_required
def BranchDetails(request, branch_id):
    branch = get_object_or_404(Branch, id=branch_id)
    if request.method == 'GET':
        json_data = {'id': branch.id, 'name': branch.name, 'transit_num': branch.transit_num,
                     'address': branch.address, 'email': branch.email,
                     'capacity': branch.capacity, 'last_modified': branch.last_modified}
        return JsonResponse(json_data)


def EditBranch(request, branch_id):
    branch = get_object_or_404(Branch, id=branch_id)
    bank = branch.bank
    if request.user != bank.owner:
        return HttpResponse('FORBIDDEN', status=403)

    if request.method == 'GET':
        form = EditBranchForm(initial={'name': branch.name, 'transit_num': branch.transit_num,
                                       'address': branch.address, 'email': branch.email,
                                       'capacity': branch.capacity, })
        return TemplateResponse(request, 'banks/edit_branch.html', {'form': form, 'branch': branch_id})
    if request.method == 'POST':
        form = EditBranchForm(request.POST, instance=branch)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(f'/banks/branch/{branch.id}/details/', status=302)
        else:
            return TemplateResponse(request, 'banks/edit_branch.html', {'form': form, 'branch': branch_id})
