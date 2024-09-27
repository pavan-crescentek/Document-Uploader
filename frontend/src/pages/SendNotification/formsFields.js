import * as Yup from 'yup';

const sendNotificationFormFields = () => {
  return [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter Title',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Enter Details',
    },
  ];
};

const sendNotificationFormFieldsValidation = Yup.object({
  title: Yup.string()
    .required('Please add a title')
    .test('not-only-spaces', 'Please enter a valid title', (value) => {
      return value && value.trim().length > 0;
    }),
  message: Yup.string()
    .required('Please add a message')
    .test('not-only-spaces', 'Please enter a valid message', (value) => {
      return value && value.trim().length > 0;
    }),
});

const sendNotificationFieldsInitialValues = () => {
  return {
    title: '',
    message: '',
  };
};

export {
  sendNotificationFieldsInitialValues,
  sendNotificationFormFields,
  sendNotificationFormFieldsValidation,
};
