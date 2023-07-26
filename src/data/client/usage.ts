import {
  Usage,
  UsagePaginator,
  UsageQueryOptions,
  CreateUsageInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
export const usageClient = {
  ...crudFactory<
    Usage,
    QueryOptions,
    { data: CreateUsageInput[]; date: string; count: number }
  >(`api/${API_ENDPOINTS.USAGES}`),
  paginated: ({ ...params }: Partial<UsageQueryOptions>) => {
    console.log('🚀 ~ file: device.ts:21 ~ paginated');
    return HttpClient.get<UsagePaginator>(`api/${API_ENDPOINTS.USAGES}`, {
      searchJoin: 'and',
      ...params,
      // search: HttpClient.formatSearchParams({ mdn, esn }),
    });
  },
};
