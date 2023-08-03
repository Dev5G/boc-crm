import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Customer } from '@/types';
import { SendPaginatedResponse, SendResponse } from '../utils';

function getDateDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  console.log('🚀 ~ file: route.ts:10 ~ getDateDaysAgo ~ date:', date);
  return date;
}

async function GetComputedValues(data: any, date: Date) {
  'use strict';

  let latestDate = new Date('2023-01-01');
  let computedData = [];
  // console.log('🚀 ~ file: route.ts:18 ~ GetComputedValues ~ usages:');
  let counter = 1;
  for (const deviceWithUsage of data) {
    let averageVoiceMinutes = 0;
    let averageDataMb = 0;
    let averageSmsCount = 0;
    let latestPlanCode = 'None';
    let latestPlanName = 'None';
    let newPlan = 'No Change Required';
    // console.log(
    //   '🚀 ~ file: route.ts:18 ~ GetComputedValues ~ usages: forlopp 1'
    // );
    let newUsage: any = null;
    if (deviceWithUsage.usage) {
      for (const usage of deviceWithUsage.usage) {
        // console.log(
        //   '🚀 ~ file: route.ts:18 ~ GetComputedValues ~ usages: forlopp 2'
        // );
        if (new Date(usage.createdAt) > latestDate) {
          latestPlanCode = usage.planCode;
          latestPlanName = usage.planName;
        }
        averageVoiceMinutes += usage.voiceMinutes;
        averageDataMb += usage.dataMb;
        averageSmsCount += usage.smsCount;
      }
    }
    // Calculate the new plan for the user
    if (latestPlanName !== 'None') {
      if (averageDataMb < 3000) {
        if (latestPlanName !== 'Below Extreme Basic')
          newPlan = 'Below Extreme Basic';
      } else if (averageDataMb < 5500) {
        if (latestPlanName !== 'Basic') newPlan = 'Basic';
      } else if (averageDataMb < 9500) {
        // TODO: this should be analyzed further.
        if (latestPlanName !== 'New Platinum') newPlan = 'New Platinum';
      }
    }

    newUsage = {
      ...deviceWithUsage,
      id: counter,
      latestPlanCode,
      latestPlanName,
      averageVoiceMinutes,
      averageDataMb,
      averageSmsCount,
      planSuggestion: newPlan,
      date: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
    };
    // console.log(
    //   '🚀 ~ file: route.ts:30 ~ GetComputedValues ~ newUsage:',
    //   newUsage
    // );
    computedData.push(newUsage);
    counter++;
  }

  return {
    computedData,
  };
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);

  console.log('🚀 ~ file: route.ts:6 ~ POST ~ Data: ', { searchParams });
  try {
    const take = Number(searchParams.get('limit')) || 10;
    const cursor = searchParams.get('cursor');
    const mdn = searchParams.get('mdn');
    const page = searchParams.get('page') || 'next';
    const reportType = searchParams.get('type') || 'normal';
    const created_at = getDateDaysAgo(
      Number(searchParams.get('dateFilter')) || 0
    );
    // console.log('🚀 ~ file: route.ts:88 ~ GET ~ reportType:', reportType);
    const whereClause = {
      ...(mdn && { mdn: { startsWith: mdn } }),
      ...(created_at && {
        usage: {
          some: {
            createdAt: {
              gte: created_at,
            },
          },
        },
      }),
    };
    //TODO add a separate non-usage route

    console.log('🚀 ~ file: route.ts:85 ~ GET ~ createdAt:', created_at);

    const deviceWithUsages = await prisma.device.findMany({
      take: page && page === 'next' ? take : page === 'prev' ? -take : take,
      select: {
        id: true,
        mdn: true,
        usage: true,
      },
      ...(mdn && {
        where: { mdn: { startsWith: mdn }, created_at: { gte: created_at }, },
      }),
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });
    console.log('🚀 ~ file: route.ts:15 ~ GET ~ usages:', deviceWithUsages);
    
    // ToDO use this for non-usage tests
    // const usage = await prisma.usage.groupBy({
    //   by: ['deviceId'],
    //   _avg: {
    //     dataMb: true,
    //     smsCount: true,
    //     voiceMinutes: true,
    //   },
    //   having: {
    //     smsCount: {
    //       _avg: {gt: 14}
    //     }
    //   },
    //   where: {
    //     deviceId: '64c2d5a77613fbc88d6ba76f',
    //   },
    // });
    // console.log('🚀 ~ file: route.ts:105 ~ GET ~ usage:', usage);
    const { computedData } = await GetComputedValues(
      deviceWithUsages,
      created_at
    );
    console.log(
      '🚀 ~ file: route.ts:15 ~ GET ~ usages-computed:',
      computedData[0]
    );
    //TODO this doesn't work/improve the deviceWithUsages check and use an empty array and then check if the devices have been computed and if so, fetch the new records accordingly.
    const usersAfterQuery = await prisma.device.findMany({
      take,
      ...(deviceWithUsages.length > 0 && {
        skip: 1,
        cursor: { id: deviceWithUsages[deviceWithUsages.length - 1].id },
      }),
    });
    const usersBeforeQuery = await prisma.device.findMany({
      take: -take,
      ...(deviceWithUsages.length > 0 && {
        skip: 1,
        cursor: { id: deviceWithUsages[0].id },
      }),
    });
    const res = {
      message: 'OK',
      data: computedData,
      pageInfo: {
        endCursor:
          deviceWithUsages.length > 0 && usersAfterQuery.length > 0
            ? deviceWithUsages[deviceWithUsages.length - 1].id
            : '',
        startCursor:
          deviceWithUsages.length > 0 && usersBeforeQuery.length > 0
            ? deviceWithUsages[0].id
            : '',
        hasNextPage: usersAfterQuery.length > 0,
        hasPrevPage: usersBeforeQuery.length > 0,
      },
    };
    // console.log('🚀 ~ file: route.ts:106 ~ GET ~ res:', res);

    return SendPaginatedResponse(res, 200);
    // if (!!customer) {
    //   return SendResponse(
    //     { message: 'Request successful', data: customer },
    //     200
    //   );
    // } else {
    //   SendResponse({ message: 'Request failed', data: [] }, 204);
    // }
  } catch (error) {
    console.log(error);
  }
  return SendResponse(
    { message: 'Something went wrong on the server', data: [] },
    500
  );
}
