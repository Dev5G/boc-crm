import {
  Customer,
  CustomerPaginator,
  CustomerQueryOptions,
  CreateCustomerInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
export const customerClient = {
  ...crudFactory<Customer, QueryOptions, CreateCustomerInput>(
    `api/${API_ENDPOINTS.CUSTOMERS}`
  ),
  paginated: ({
    name,
    phone_number,
    ...params
  }: Partial<CustomerQueryOptions>) => {
    console.log('🚀 ~ file: device.ts:21 ~ paginated');
    return HttpClient.get<CustomerPaginator>(`api/${API_ENDPOINTS.CUSTOMERS}`, {
      searchJoin: 'and',
      ...params,
      // search: HttpClient.formatSearchParams({ mdn, esn }),
    });
  },
};
