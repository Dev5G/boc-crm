import UsageList from '@/components/usage/usage-list';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import TypeFilter from '@/components/category/type-filter';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { useUsagesQuery } from '@/data/usage';
import cn from 'classnames';
import { HiArrowDown } from 'react-icons/hi';
export default function Usages() {
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  const { usages, paginatorInfo, loading, error } = useUsagesQuery({
    limit: 20,
    page,
    mdn: searchTerm,
    orderBy,
    sortedBy,
    language: locale,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    // setSearchTerm(searchText);
    // setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:input-label-usages')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <HiArrowDown className="ms-2" />
            ) : (
              <HiArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            {/* <CategoryTypeFilter
              className="w-full"
              onCategoryFilter={({ slug }: { slug: string }) => {
                setPage(1);
                setCategory(slug);
              }}
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
                setPage(1);
              }}
            /> */}
          </div>
        </div>
      </Card>
      <UsageList
        usages={usages}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Usages.authenticate = {
  permissions: adminOnly,
};
Usages.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
