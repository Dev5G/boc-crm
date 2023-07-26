import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Customer,
  CategoryPaginator,
  CategoryQueryOptions,
  GetParams,
  CustomerQueryOptions,
  CustomerPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
// import { categoryClient } from './client/category';
import { Config } from '@/config';
import { customerClient } from './client/customer';

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(customerClient.create, {
    onSuccess: () => {
      // Router.push(Routes.category.list, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DEVICES);
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(customerClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useUpdateCustomerMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(customerClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DEVICES);
    },
  });
};

export const useCustomerQuery = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<Customer, Error>(
    [API_ENDPOINTS.DEVICES, { slug }],
    () => customerClient.get({ slug, language: 'en' })
  );

  return {
    customers: data,
    error,
    isLoading,
  };
};

export const useCustomersQuery = (options: Partial<CustomerQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CustomerPaginator, Error>(
    [API_ENDPOINTS.DEVICES, options],
    ({ queryKey, pageParam }) =>
      customerClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );
  console.log('🚀 ~ file: customer.ts:82 ~ useCustomersQuery ~ data:', {
    data: data?.body.data,
  });

  return {
    customers: data?.body.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
