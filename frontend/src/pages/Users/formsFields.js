import * as Yup from 'yup';

const usersFormFields = (statusOption) => {
  return [
    {
      name: 'email',
      label: 'User email',
      type: 'email',
      placeholder: 'Enter user email',
    },
    {
      name: 'firstName',
      label: 'First name',
      type: 'text',
      placeholder: 'Enter first name',
    },
    {
      name: 'lastName',
      label: 'Last name',
      type: 'text',
      placeholder: 'Enter last name',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
    },
    {
      name: 'isActive',
      label: 'Is active',
      type: 'select',
      placeholder: 'Select status',
      options: statusOption,
    },
  ];
};

const usersFormFieldsValidation = (isEdit) =>
  Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    firstName: Yup.string()
      .min(3, 'First name must be at least 3 characters')
      .max(30, 'First name must not exceed 30 characters')
      .required('First name is required')
      .test('not-only-spaces', 'Please enter a valid First Name', (value) => {
        return value && value.trim().length > 0;
      }),
    lastName: Yup.string()
      .min(3, 'Last name must be at least 3 characters')
      .max(30, 'Last name must not exceed 30 characters')
      .required('Last name is required')
      .test('not-only-spaces', 'Please enter a valid Last Name', (value) => {
        return value && value.trim().length > 0;
      }),
    password: isEdit
      ? Yup.string()
          .min(12, 'Password must be at least 12 characters')
          .nullable()
      : Yup.string()
          .required('Password is required')
          .min(12, 'Password must be at least 12 characters'),
    isActive: Yup.boolean()
      .required('Please add status')
      .oneOf([true, false], 'Please add status'),
  });

const usersFieldsInitialValues = (selectUser) => {
  return {
    email: selectUser?.email || '',
    firstName: selectUser?.firstName || '',
    lastName: selectUser?.lastName || '',
    password: '',
    isActive:
      selectUser?.isActive !== undefined
        ? selectUser.isActive.toString()
        : 'true',
    id: selectUser?.id || '',
  };
};

export { usersFieldsInitialValues, usersFormFields, usersFormFieldsValidation };
