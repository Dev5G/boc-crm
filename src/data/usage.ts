import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Usage,
  CategoryPaginator,
  CategoryQueryOptions,
  GetParams,
  UsageQueryOptions,
  UsagePaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
// import { categoryClient } from './client/category';
import { Config } from '@/config';
import { usageClient } from './client/usage';

export const useCreateUsageMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(usageClient.bulk, {
    onSuccess: () => {
      // Router.push(Routes.category.list, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USAGES);
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(usageClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useUpdateUsageMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(usageClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USAGES);
    },
  });
};

export const useUsageQuery = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<Usage, Error>(
    [API_ENDPOINTS.USAGES, { slug }],
    () => usageClient.get({ slug, language: 'en' })
  );

  return {
    usages: data,
    error,
    isLoading,
  };
};

export const useUsagesQuery = (options: Partial<UsageQueryOptions>) => {
  const { data, error, isLoading } = useQuery<UsagePaginator, Error>(
    [API_ENDPOINTS.USAGES, options],
    ({ queryKey, pageParam }) =>
      usageClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );
  console.log('🚀 ~ file: usage.ts:82 ~ useUsagesQuery ~ data:', {
    data: data?.body.data,
  });

  return {
    usages: data?.body.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
