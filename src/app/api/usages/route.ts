import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Customer } from '@/types';
import { SendResponse } from '../utils';
import fs from 'fs';
import * as x from 'xlsx';



export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  // const filename = await fs.readFile(
  //   './public/ToneCommunications GSM Billing Support File 06-11-2023New Logic.xlsx',
  //   async (d) => {
  //     const data = x.read(d);
  //     console.log('🚀 ~ file: route.ts:11 ~ filename ~ data:', data);

  //     const jsonData = x.utils.sheet_to_json<any[]>(data, { header: 1 });
  //     console.log(jsonData);
  //   }
  // );
  console.log('🚀 ~ file: route.ts:6 ~ POST ~ Data: ', { searchParams });
  // return SendResponse({ message: '', data: [] });
  try {
    const take = Number(searchParams.get('limit')) || 10;
    const skip = Number(searchParams.get('page')) || 0;
    
    const usage = await prisma.device.findMany({
      select: { id: true, mdn: true, usage: true },
      take,
      skip,
    });
    console.log('🚀 ~ file: route.ts:15 ~ GET ~ usages:', usage);

    return SendResponse({ message: 'OK', data: usage }, 200);
    // if (!!customer) {
    //   return SendResponse(
    //     { message: 'Request successful', data: customer },
    //     200
    //   );
    // } else {
    //   SendResponse({ message: 'Request failed', data: [] }, 204);
    // }
  } catch (error) {}
  return SendResponse(
    { message: 'Something went wrong on the server', data: [] },
    500
  );
}
