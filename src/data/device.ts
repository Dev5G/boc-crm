import Router from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Device,
  CategoryPaginator,
  CategoryQueryOptions,
  GetParams,
  DeviceQueryOptions,
  DevicePaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { categoryClient } from './client/category';
import { Config } from '@/config';
import { deviceClient } from './client/device';

export const useCreateDeviceMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(deviceClient.create, {
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

export const useUpdateDeviceMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(deviceClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DEVICES);
    },
  });
};

export const useDeviceQuery = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery<Device, Error>(
    [API_ENDPOINTS.DEVICES, { slug }],
    () => deviceClient.get({ slug, language: 'en' })
  );

  return {
    devices: data,
    error,
    isLoading,
  };
};

export const useDevicesQuery = (options: Partial<DeviceQueryOptions>) => {
  const { data, error, isLoading } = useQuery<DevicePaginator, Error>(
    [API_ENDPOINTS.DEVICES, options],
    ({ queryKey, pageParam }) =>
      deviceClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );
  console.log('🚀 ~ file: device.ts:82 ~ useDevicesQuery ~ data:', {
    data: data?.body.data,
  });

  return {
    devices: data?.body.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
