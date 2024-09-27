import * as Yup from 'yup';

const partnersFormFields = (statusOption) => {
  return [
    {
      name: 'name',
      label: 'Partner Name',
      type: 'text',
      placeholder: 'Enter Partner Name',
    },
    {
      name: 'activeStatus',
      label: 'Is Active',
      type: 'select',
      placeholder: 'Select Status',
      options: statusOption,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter Partner Email',
    },
    {
      name: 'commission_percentage',
      label: 'Commission Percentage',
      type: 'number',
      placeholder: 'Enter Commission Percentage',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter Password For Partner Account',
    },
  ];
};

const partnersFormFieldsValidation = (isEdit) =>
  Yup.object({
    name: Yup.string()
      .required('Please Partner Name')
      .test('not-only-spaces', 'Please enter a valid Partner Name', (value) => {
        return value && value.trim().length > 0;
      }),
    activeStatus: Yup.boolean()
      .required('Please add status')
      .oneOf([true, false], 'Please add status'),
    email: Yup.string()
      .required('Please enter an email address')
      .email('Please enter a valid email address'),
    commission_percentage: Yup.number()
      .required('Please enter commission percentage')
      .moreThan(0, 'Commission percentage must be a positive number.'),
    password: isEdit
      ? Yup.string().min(8, 'Password must be at least 8 characters').nullable()
      : Yup.string()
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters'),
  });

const partnerFieldsInitialValues = (selectPartner) => {
  return {
    name: selectPartner?.name || '',
    activeStatus:
      selectPartner && selectPartner?.active.toString() !== undefined
        ? selectPartner.active.toString()
        : 'true',
    id: selectPartner?.id || '',
    email: selectPartner?.email || '',
    password: '',
    commission_percentage: selectPartner?.commission_percentage || 0,
  };
};

const partnersBankDetailsFormFields = (statusOption) => {
  return [
    {
      name: 'name',
      label: 'Account Holder Name',
      type: 'text',
      placeholder: 'Enter Account Holder Name',
    },
    {
      name: 'bank_name',
      label: 'Bank Name',
      type: 'text',
      placeholder: 'Enter Bank Name',
    },
    {
      name: 'branch_name',
      label: 'Branch Name',
      type: 'text',
      placeholder: 'Enter Bank Name',
    },
    {
      name: 'account_number',
      label: 'Account Number',
      type: 'number',
      placeholder: 'Enter Account Number',
    },
    {
      name: 'ifsc',
      label: 'IFSC Code',
      type: 'text',
      placeholder: 'Enter IFSC Code',
    },
    {
      name: 'active',
      label: 'Is Active',
      type: 'select',
      placeholder: 'Select Status',
      options: statusOption,
    },
  ];
};

const partnersBankDetailsFormFieldsValidation = () =>
  Yup.object({
    name: Yup.string()
      .required('Please add account holder name')
      .test(
        'not-only-spaces',
        'Please enter a valid account holder name',
        (value) => {
          return value && value.trim().length > 0;
        }
      ),
    bank_name: Yup.string()
      .required('Please add bank name')
      .test('not-only-spaces', 'Please enter a valid bank name', (value) => {
        return value && value.trim().length > 0;
      }),
    branch_name: Yup.string()
      .required('Please add branch name')
      .test('not-only-spaces', 'Please enter a valid branch name', (value) => {
        return value && value.trim().length > 0;
      }),
    account_number: Yup.string()
      .required('Please add account number')
      .matches(/^\d{9,18}$/, 'Please enter a valid account number'),

    ifsc: Yup.string()
      .required('Please add IFSC code')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'),
    active: Yup.boolean()
      .required('Please add status')
      .oneOf([true, false], 'Please add status'),
  });

const partnerBankDetailsFieldsInitialValues = (selectPartner) => {
  return {
    name: selectPartner?.name || '',
    active:
      selectPartner && selectPartner?.active !== undefined
        ? selectPartner.active.toString()
        : 'true',
    user_id: selectPartner?.user_id || '',
    bank_name: selectPartner?.bank_name || '',
    branch_name: selectPartner?.branch_name || '',
    account_number: selectPartner?.account_number || '',
    ifsc: selectPartner?.ifsc || '',
  };
};

export {
  partnerBankDetailsFieldsInitialValues,
  partnerFieldsInitialValues,
  partnersBankDetailsFormFields,
  partnersBankDetailsFormFieldsValidation,
  partnersFormFields,
  partnersFormFieldsValidation,
};
