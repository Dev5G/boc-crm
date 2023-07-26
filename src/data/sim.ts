import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Sim,
  CategoryPaginator,
  CategoryQueryOptions,
  GetParams,
  SimQueryOptions,
  SimPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { categoryClient } from './client/category';
import { Config } from '@/config';
import { simClient } from './client/sim';

export const useCreateSimMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(simClient.create, {
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

  return useMutation(categoryClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useUpdateSimMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(simClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DEVICES);
    },
  });
};

export const useSimQuery = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<Sim, Error>(
    [API_ENDPOINTS.DEVICES, { slug }],
    () => simClient.get({ slug, language: 'en' })
  );

  return {
    sims: data,
    error,
    isLoading,
  };
};

export const useSimsQuery = (options: Partial<SimQueryOptions>) => {
  const { data, error, isLoading } = useQuery<SimPaginator, Error>(
    [API_ENDPOINTS.DEVICES, options],
    ({ queryKey, pageParam }) =>
      simClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );
  console.log('🚀 ~ file: sim.ts:82 ~ useSimsQuery ~ data:', {
    data: data?.body.data,
  });

  return {
    sims: data?.body.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
