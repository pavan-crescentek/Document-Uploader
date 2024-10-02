import * as Yup from 'yup';

const documentFormFields = (sectionOptions, subsectionOptions) => {
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
  metadata: Yup.string()
    .required('Please metadata')
    .test('not-only-spaces', 'Please enter a valid metadata', (value) => {
      return value && value.trim().length > 0;
    }),
  section: Yup.string().required('Section is required'),
  subsection: Yup.string().required('Section is required'),
});

const documentFieldsInitialValues = (selectDocument) => {
  return {
    metadata: selectDocument?.metadata || '',
    section: selectDocument?.section || '',
    subsection: selectDocument?.subsection || '',
    id: selectDocument?.id || '',
  };
};

export {
  documentFieldsInitialValues,
  documentFormFields,
  documentFormFieldsValidation,
};
