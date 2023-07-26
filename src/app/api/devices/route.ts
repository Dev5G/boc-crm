import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Device } from '@/types';
import { SendResponse } from '../utils';

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);

  console.log('🚀 ~ file: route.ts:6 ~ POST ~ Data: ', { searchParams });
  try {
    const take = Number(searchParams.get('take')) || 10;
    const devices = await prisma.device.findMany({
      select: { id: true, mdn: true, esn: true, imei: true },
      take,
    });
    console.log('🚀 ~ file: route.ts:15 ~ GET ~ devices:', devices);

    if (!!devices) {
      return SendResponse(
        { message: 'Request successful', data: devices },
        200
      );
    } else {
        SendResponse({ message: 'Request failed', data: [] } , 204)
    }

  } catch (error) {}
  return SendResponse(
    { message: 'Something went wrong on the server', data: [] },
    500
  );
}
