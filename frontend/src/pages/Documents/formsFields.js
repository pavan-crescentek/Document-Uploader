import * as Yup from 'yup';

const documentFormFields = (sectionOptions, subsectionOptions) => {
  return [
    {
      name: 'metadata',
      label: 'File name',
      type: 'text',
      placeholder: 'Enter file name',
    },
    {
      name: 'section',
      label: 'Section',
      type: 'select',
      placeholder: 'Select section',
      options: sectionOptions,
    },
    {
      name: 'subsection',
      label: 'Sub-section',
      type: 'select',
      placeholder: 'Select sub-section',
      options: subsectionOptions,
    },
  ];
};

const documentFormFieldsValidation = Yup.object({
  metadata: Yup.string()
    .required('Fine name is required')
    .test('not-only-spaces', 'Enter a valid file name', (value) => {
      return value && value.trim().length > 0;
    }),
  section: Yup.string().required('Section is required'),
  subsection: Yup.string().required('Sub-section is required'),
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
