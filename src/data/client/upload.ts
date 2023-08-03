import { HttpClient } from './http-client';
import { API_ENDPOINTS } from './api-endpoints';
import { Attachment } from '@/types';

export const uploadClient = {
  upload: async (
    file: any,
    data: any,
    url: string = '/api/v2/usages/create/bulk'
  ) => {
    let formData = new FormData();

    formData.append('file', file);
    formData.append('data', data);
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return HttpClient.post<{ status: number; data: any; error: string }>(
      url,
      formData,
      options
    );
  },
};
