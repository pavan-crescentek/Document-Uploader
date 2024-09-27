import * as Yup from 'yup';

const groundsFormFields = (
  countriesList,
  stateList,
  citiesList,
  statusOption,
  categoryOptions
) => {
  return [
    {
      name: 'name',
      label: 'Ground Name',
      type: 'text',
      placeholder: 'Enter Name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter Email',
    },
    {
      name: 'mobile_number',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: 'Enter Mobile Number',
    },
    {
      name: 'person_name',
      label: 'Person Name',
      type: 'text',
      placeholder: 'Enter Person Name',
    },
    {
      name: 'details',
      label: 'Details',
      type: 'textarea',
      placeholder: 'Enter Details',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter Address',
    },
    {
      name: 'latitude',
      label: 'Latitude',
      type: 'number',
      placeholder: 'Enter Latitude',
    },
    {
      name: 'longitude',
      label: 'Longitude',
      type: 'number',
      placeholder: 'Enter Longitude',
    },
    {
      name: 'country_id',
      label: 'Country',
      placeholder: 'Slecte Category',
      type: 'select',
      options: countriesList,
    },
    {
      name: 'state_id',
      label: 'State',
      placeholder: 'Select State',
      type: 'select',
      options: stateList,
    },
    {
      name: 'city_id',
      label: 'City',
      placeholder: 'Select City',
      type: 'select',
      options: citiesList,
    },
    {
      name: 'active',
      label: 'Status',
      placeholder: 'Select status',
      type: 'select',
      options: statusOption,
    },
    {
      name: 'cat_id',
      label: 'Category',
      placeholder: 'Enter Category',
      type: 'select',
      options: categoryOptions,
    },
    {
      name: 'youtube_link',
      label: 'YouTube Link',
      type: 'text',
      placeholder: 'Enter YouTube Link',
    },
    {
      name: 'whatsapp_number',
      label: 'WhatsApp Number',
      type: 'tel',
      placeholder: 'Enter WhatsApp Number',
    },
    {
      name: 'twitter',
      label: 'X',
      type: 'text',
      placeholder: 'Enter X',
    },
    {
      name: 'instagram',
      label: 'Instagram',
      type: 'text',
      placeholder: 'Enter Instagram',
    },
    {
      name: 'facebook',
      label: 'Facebook',
      type: 'text',
      placeholder: 'Enter Facebook',
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Enter Website',
    },
  ];
};

const groundsFormFieldsValidation = Yup.object({
  name: Yup.string()
    .required('Please Ground Name')
    .test('not-only-spaces', 'Please enter a valid Ground Name', (value) => {
      return value && value.trim().length > 1;
    }),
  email: Yup.string().email('Invalid email').required('Email is required'),
  details: Yup.string().required('Details are required'),
  mobile_number: Yup.number()
    .required('Mobile number is required')
    .test('valid-mobile', 'Invalid mobile number', (value) => {
      return /^[0-9]{10}$/.test(value);
    }),
  cat_id: Yup.string().required('Category ID is required'),
  active: Yup.boolean().required('Status is required').oneOf([true, false]),
  address: Yup.string().required('Address is required'),
  latitude: Yup.number().required('Latitude is required'),
  longitude: Yup.number().required('Longitude is required'),
  youtube_link: Yup.string().url('Invalid URL'),
  whatsapp_number: Yup.string().test(
    'valid-mobile',
    'Invalid mobile number',
    (value) => {
      return /^[0-9]{10}$/.test(value);
    }
  ),
  twitter: Yup.string().url('Invalid URL'),
  instagram: Yup.string().url('Invalid URL'),
  facebook: Yup.string().url('Invalid URL'),
  website: Yup.string().url('Invalid URL'),
  person_name: Yup.string().required('Person name is required'),
  country_id: Yup.number().required('Please select country'),
  state_id: Yup.number().required('Please select state'),
  city_id: Yup.number(),
});

const groundFieldsInitialValues = (selectGround) => {
  return {
    name: selectGround?.name || '',
    email: selectGround?.email || '',
    details: selectGround?.details || '',
    mobile_number: selectGround?.mobile_number || '',
    cat_id: selectGround?.cat_id || '',
    active: selectGround?.active || 'false',
    address: selectGround?.address || '',
    latitude: selectGround?.latitude || '',
    longitude: selectGround?.longitude || '',
    youtube_link: selectGround?.youtube_link || '',
    whatsapp_number: selectGround?.whatsapp_number || '',
    twitter: selectGround?.twitter || '',
    instagram: selectGround?.instagram || '',
    facebook: selectGround?.facebook || '',
    website: selectGround?.website || '',
    id: selectGround?.id || '',
    person_name: selectGround?.person_name || '',
    country_id: selectGround?.country_id || '',
    state_id: selectGround?.state_id || '',
    city_id: selectGround?.city_id || '',
  };
};

export {
  groundFieldsInitialValues,
  groundsFormFields,
  groundsFormFieldsValidation,
};
