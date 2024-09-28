import * as Yup from 'yup';

const usersFormFields = (statusOption) => {
  return [
    {
      name: 'email',
      label: 'User Email',
      type: 'email',
      placeholder: 'Enter user email',
    },
    {
      name: 'firstName',
      label: 'User First Name',
      type: 'text',
      placeholder: 'Enter first name',
    },
    {
      name: 'lastName',
      label: 'User Last Name',
      type: 'text',
      placeholder: 'Enter last email',
    },
    {
      name: 'password',
      label: 'User Password',
      type: 'password',
      placeholder: 'Enter user password',
    },
    {
      name: 'activeStatus',
      label: 'Is Active',
      type: 'select',
      placeholder: 'Select Status',
      options: statusOption,
    },
  ];
};

const usersFormFieldsValidation = Yup.object({
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
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  activeStatus: Yup.boolean()
    .required('Please add status')
    .oneOf([true, false], 'Please add status'),
});

const usersFieldsInitialValues = (selectUser) => {
  return {
    email: selectUser?.email || '',
    firstName: selectUser?.firstName || '',
    lastName: selectUser?.lastName || '',
    password: '',
    activeStatus:
      selectUser?.activeStatus !== undefined
        ? selectUser.activeStatus.toString()
        : 'true',
    id: selectUser?.id || '',
  };
};

export { usersFieldsInitialValues, usersFormFields, usersFormFieldsValidation };
