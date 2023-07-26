import {
  Sim,
  SimPaginator,
  SimQueryOptions,
  CreateSimInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
export const simClient = {
  ...crudFactory<Sim, QueryOptions, CreateSimInput>(
    `api/${API_ENDPOINTS.SIMS}`
  ),
  paginated: ({ mdn, esn, ...params }: Partial<SimQueryOptions>) => {
    console.log('🚀 ~ file: device.ts:21 ~ paginated');
    return HttpClient.get<SimPaginator>(`api/${API_ENDPOINTS.SIMS}`, {
      searchJoin: 'and',
      ...params,
      // search: HttpClient.formatSearchParams({ mdn, esn }),
    });
  },
};
