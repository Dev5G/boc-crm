import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  phone_number: yup.string().required('form:error-phone-number-required'),
  address: yup.string().required('form:error-address-required'),
  email: yup.string().required('form:error-email-required'),
  state: yup.string().required('form:error-state-required'),
  city: yup.string().required('form:error-city-required'),
  zip_code: yup.string().required('form:error-zip-code-required'),
});
