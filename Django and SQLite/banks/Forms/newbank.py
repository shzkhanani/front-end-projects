from django import forms

from banks.models import Bank


# Reference : Lecture

class AddBank(forms.Form):
    name = forms.CharField(label='name', max_length=110, required=True, error_messages={'required': 'This field is '
                                                                                                    'required'})
    swift_code = forms.CharField(label='swift_code', max_length=110, required=True,
                                 error_messages={'required': 'This field is '
                                                             'required'})
    inst_num = forms.CharField(label='inst_num', max_length=110, required=True,
                               error_messages={'required': 'This field is '
                                                           'required'})
    description = forms.CharField(label='description', max_length=110, required=True,
                                  error_messages={'required': 'This field is '
                                                              'required'})

    # Reference for function in error : Lecture code
    def clean_name(self):
        data = super().clean()
        name = data.get('name')
        if len(name) > 100:
            self.add_error('name', f'Ensure this value has at most 100 characters (it has {len(name)} )')
        return name

    def clean_swift_code(self):
        data = super().clean()
        swift_code = data.get('swift_code')
        if len(swift_code) > 100:
            self.add_error('swift_code', f'Ensure this value has at most 100 characters (it has {len(swift_code)} )')
        return swift_code

    def clean_inst_num(self):
        data = super().clean()
        inst_num = data.get('inst_num')
        if len(inst_num) > 100:
            self.add_error('inst_num', f'Ensure this value has at most 100 characters (it has {len(inst_num)} )')
        return inst_num

    def clean_description(self):
        data = super().clean()
        description = data.get('description')
        if len(description) > 100:
            self.add_error('inst_num', f'Ensure this value has at most 100 characters (it has {len(description)} )')
        return description
