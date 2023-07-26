import {
  Device,
  DevicePaginator,
  DeviceQueryOptions,
  CreateDeviceInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
const baseURL = 'http://localhost:3002/';
export const deviceClient = {
  ...crudFactory<Device, QueryOptions, CreateDeviceInput>(
    `/api/${API_ENDPOINTS.DEVICES}`
  ),
  paginated: ({ mdn, esn, ...params }: Partial<DeviceQueryOptions>) => {
    console.log('🚀 ~ file: device.ts:21 ~ baseURL: called', baseURL);
    return HttpClient.get<DevicePaginator>(
      `${baseURL}/api/${API_ENDPOINTS.DEVICES}`,
      {
        searchJoin: 'and',
        ...params,
        // search: HttpClient.formatSearchParams({ mdn, esn }),
      }
    );
  },
};
