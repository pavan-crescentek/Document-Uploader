import * as Yup from 'yup';

const documentFormFields = (statusOption) => {
  const sectionOptions = statusOption.map((item) => ({
    value: item.section,
    label: item.section.toUpperCase(),
  }));
  const subsectionOptions = statusOption.flatMap((item) =>
    item.subsection.map((sub) => ({
      value: sub,
      label: sub,
    }))
  );

  return [
    {
      name: 'metadata',
      label: 'Metadata',
      type: 'text',
      placeholder: 'Enter document metadata',
    },
    {
      name: 'section',
      label: 'Section',
      type: 'select',
      placeholder: 'Select Section',
      options: sectionOptions,
    },
    {
      name: 'subsection',
      label: 'Subsection',
      type: 'select',
      placeholder: 'Select Subsection',
      options: subsectionOptions,
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
