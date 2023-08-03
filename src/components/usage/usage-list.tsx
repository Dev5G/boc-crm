import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { Usage, SortOrder, MappedPaginatorInfo, UsageReport } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import Badge from '../ui/badge/badge';
import PlanColor from './plan-color';
export type IPageInfo = {
  hasNextPage: boolean;
  endCursor: string;
  startCursor: string;
  hasPrevPage: boolean;
};
export type IProps = {
  usages: UsageReport[] | undefined;
  pageInfo: IPageInfo | undefined;
  onPagination: (key: string) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const UsageList = ({
  usages,
  pageInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 60,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-mdn')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'mdn'
          }
          isActive={sortingObj.column === 'mdn'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'mdn',
      key: 'mdn',
      align: alignLeft,
      width: 150,
      onHeaderCell: () => onHeaderClick('mdn'),
    },
    {
      title: t('table:table-item-plan-code'),
      dataIndex: 'latestPlanCode',
      key: 'latestPlanCode',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-plan-name'),
      dataIndex: 'latestPlanName',
      key: 'latestPlanCode',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-sms-count'),
      dataIndex: 'averageSmsCount',
      key: 'averageSmsCount',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-voice-minutes'),
      dataIndex: 'averageVoiceMinutes',
      key: 'averageVoiceMinutes',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-data-mb'),
      dataIndex: 'averageDataMb',
      key: 'averageDataMb',
      align: alignLeft,
      width: 150,
    },
    {
      title: t('table:table-item-plan-suggestion'),
      dataIndex: 'planSuggestion',
      key: 'actions',
      align: alignRight,
      width: 290,
      render: (id: string, record: UsageReport) => (
        <Badge
          text={record.planSuggestion}
          color={PlanColor(record.planSuggestion)}
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'actions',
      align: alignRight,
      width: 290,
      // render: (id: string, record: UsageReport) => (
      //   <Badge
      //     text={record.planSuggestion}
      //     color={PlanColor(record.planSuggestion)}
      //   />
      // ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={usages}
          rowKey="id"
          scroll={{ x: 1000 }}
          // expandable={{
          //   expandedRowRender: () => ' ',
          //   rowExpandable: rowExpandable,
          // }}
        />
      </div>

      {!!pageInfo && (
        <div className="flex items-center justify-end gap-2">
          {/* <Pagination
            // current={paginatorInfo.currentPage}
            // pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          /> */}
          {pageInfo.hasPrevPage && (
            <div
              className="h-8 w-8 flex items-center justify-center rounded border-2 border-slate-300 cursor-pointer hover:border-slate-400"
              onClick={() => {
                onPagination('prev');
              }}
            >
              <RiArrowLeftSLine />
            </div>
          )}
          {pageInfo.hasNextPage && (
            <div
              className="h-8 w-8 flex items-center justify-center rounded border-2 border-slate-300 cursor-pointer hover:border-slate-400"
              onClick={() => {
                onPagination('next');
              }}
            >
              <RiArrowRightSLine />
            </div>
          )}
          {/* <MdKeyboardArrowLeft /> */}
        </div>
      )}
    </>
  );
};

export default UsageList;
