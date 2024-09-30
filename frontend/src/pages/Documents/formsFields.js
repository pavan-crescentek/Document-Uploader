import * as Yup from 'yup';

const documentFormFields = (statusOption) => {
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
  ];
};

const documentFormFieldsValidation = Yup.object({
  name: Yup.string()
    .required('Please Partner Name')
    .test('not-only-spaces', 'Please enter a valid Partner Name', (value) => {
      return value && value.trim().length > 0;
    }),
  activeStatus: Yup.boolean()
    .required('Please add status')
    .oneOf([true, false], 'Please add status'),
});

const documentFieldsInitialValues = (selectCategory) => {
  return {
    name: selectCategory?.name || '',
    activeStatus:
      selectCategory && selectCategory?.active.toString() !== undefined
        ? selectCategory.active.toString()
        : 'true',
    id: selectCategory?.id || '',
  };
};

export {
  documentFieldsInitialValues,
  documentFormFields,
  documentFormFieldsValidation,
};
