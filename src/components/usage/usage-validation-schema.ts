import * as yup from 'yup';

const SUPPORTED_FORMATS = ['excel/xlsx'];

export const usageValidationSchema = yup.object().shape({
  file: yup.mixed().required('A file is required'),
});
