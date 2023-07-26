import * as yup from 'yup';

export const simValidationSchema = yup.object().shape({
  esn: yup.string().required('form:error-esn-required'),
  // type: yup.object().nullable().required('form:error-type-required'),
});
