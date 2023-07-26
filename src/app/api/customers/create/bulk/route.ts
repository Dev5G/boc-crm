import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Device } from '@/types';
import { SendResponse } from '../../../utils';

export async function POST(req: Request, res: Response) {
  // const data: Device = JSON.parse(await req.json());

  console.log('🚀 ~ file: bulk.ts:9 ~ POST ~ : ');

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
