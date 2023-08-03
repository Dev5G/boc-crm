import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateUsageInput, Device } from '@/types';
import { SendResponse } from '../../../utils';

export async function POST(req: Request, res: Response) {
  const { data, date, count } = await req.json();
  console.log(
    '🚀 ~ file: route.ts:8 ~ POST ~ data, date, count:',
    // data,
    date,
    count
  );
  const newDate = new Date(date.toString());
  newDate.setDate(newDate.getDate() + 1);
  
  // const { data, date }: { data: CreateUsageInput[]; date: string } =
  
  if (!!data) {

    try {
      const length = data.length;
      console.log('🚀 ~ file: route.ts:16 ~ POST ~ length:', length);

      for (let i = 18645; i <= count; i++) {
        const device = await prisma.device.findFirst({
          where: { mdn: data[i].device?.mdn },
          select: { id: true },
        });

        if (!!device) {
          console.log('🚀 ~ file: route.ts:23 ~ POST ~ Found:', device);
          const usage = await prisma.usage.create({
            data: {
              voiceMinutes: data[i].voiceMinutes,
              dataMb: data[i].dataMb,
              smsCount: data[i].smsCount,
              deviceId: device.id,
              planName: data[i].planName,
              planCode: Number(data[i].planCode) || 0,
              ...(newDate && { createdAt: newDate }),
            },
          });
          console.log('🚀 ~ file: route.ts:14 ~ POST ~ created:', i);
        } else {
          if (!!data[i].device) {
            const mdn = data[i].device?.mdn;
            if (mdn) {
              const device = await prisma.device.create({
                data: { mdn: mdn },
                select: { id: true },
              });
              console.log('🚀 ~ file: route.ts:23 ~ POST ~ Created:', device);

              const usage = await prisma.usage.create({
                data: {
                  voiceMinutes: data[i].voiceMinutes,
                  dataMb: data[i].dataMb,
                  smsCount: data[i].smsCount,
                  deviceId: device.id,
                  planName: data[i].planName,
                  planCode: Number(data[i].planCode) || 0,
                  ...(newDate && { createdAt: newDate }),
                },
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // if (!!data) {
  //   let counter = 0;
  //   const usages = Promise.all(
  //     data.map(async (item) => {
  //       const device = await prisma.device.findFirst({
  //         where: { mdn: item.device?.mdn },
  //         select: { id: true },
  //       });
  //       counter++;
  //       console.log('🚀 ~ file: route.ts:23 ~ POST ~ created:', counter);
  //       if (!!device) {
  //         console.log('🚀 ~ file: route.ts:23 ~ POST ~ Found:', device);
  //         const usage = await prisma.usage.create({
  //           data: {
  //             voiceMinutes: item.voiceMinutes,
  //             dataMb: item.dataMb,
  //             smsCount: item.smsCount,
  //             deviceId: device.id,
  //             planName: item.planName,
  //             planCode: item.planCode,
  //             ...(date && { createdAt: date }),
  //           },
  //         });
  //         return usage;
  //       } else {
  //         if (item.device) {
  //           const device = await prisma.device.create({
  //             data: { mdn: item.device?.mdn },
  //             select: { id: true },
  //           });
  //           console.log('🚀 ~ file: route.ts:23 ~ POST ~ Created:', device);
  //           const usage = await prisma.usage.create({
  //             data: {
  //               voiceMinutes: item.voiceMinutes,
  //               dataMb: item.dataMb,
  //               smsCount: item.smsCount,
  //               deviceId: device.id,
  //               planName: item.planName,
  //               planCode: item.planCode,
  //               ...(date && { createdAt: date }),
  //             },
  //           });
  //           return usage;
  //         }
  //       }
  //     })
  //   );
  // }
  // if (!!data) {
  //   const device = await prisma.device.findFirst({
  //     where: { mdn: data.mdn },
  //   });
  //   console.log('🚀 ~ file: route.ts:19 ~ POST ~ device:', device);
  //   if (!!device) {
  //     console.log('🚀 ~ file: route.ts:23 ~ POST ~ Skipped:', device);
  //     return SendResponse(
  //       { message: 'Device Already Exists', data: null },
  //       409
  //     );
  //   }
  //   const createdDevice = await prisma.device.create({
  //     data: {
  //       mdn: data.mdn,
  //       esn: data.esn,
  //       imei: data.imei,
  //     },
  //   });
  //   return SendResponse(
  //     { message: 'Device created successfully', data: createdDevice },
  //     201
  //   );
  // }
  return SendResponse(
    { message: 'Something went wrong on the server', data: null },
    200
  );
}
