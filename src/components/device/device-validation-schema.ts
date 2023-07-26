import * as yup from 'yup';

export const deviceValidationSchema = yup.object().shape({
  mdn: yup.string().required('form:error-mdn-required'),
  // type: yup.object().nullable().required('form:error-type-required'),
});
