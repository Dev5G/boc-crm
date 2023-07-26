import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Sim } from '@/types';
import { SendResponse } from '../../utils';

export async function POST(req: Request, res: Response) {
  const data: Sim = await req.json();

  console.log('🚀 ~ file: route.ts:6 ~ POST ~ Data: ', data) , " URL: ", req.url;
  if (!!data) {
    const sim = await prisma.sim.findFirst({
      where: { esn: data.esn },
    });
    console.log('🚀 ~ file: route.ts:19 ~ POST ~ SIM:', sim);
    if (!!sim) {
      console.log('🚀 ~ file: route.ts:23 ~ POST ~ Skipped:', sim);
      return SendResponse({ message: 'SIM Already Exists', data: null }, 409);
    }
    const createdSIM = await prisma.sim.create({
      data: {
        mdn: data.mdn,
        esn: data.esn,
        imei: data.imei,
      },
    });
    return SendResponse(
      { message: 'SIM created successfully', data: createdSIM },
      201
    );
  }
  return SendResponse(
    { message: 'Something went wrong on the server', data: [] },
    500
  );
}
