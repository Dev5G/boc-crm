import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Customer } from '@/types';
import { SendResponse } from '../../utils';

export async function POST(req: Request, res: Response) {
  const data: Customer = await req.json();

  console.log('🚀 ~ file: route.ts:6 ~ POST ~ Data: ', data), ' URL: ', req.url;
  if (!!data) {
    const customer = await prisma.customer.findFirst({
      where: { phone_number: data.phone_number },
    });
    console.log('🚀 ~ file: route.ts:19 ~ POST ~ SIM:', customer);
    if (!!customer) {
      console.log('🚀 ~ file: route.ts:23 ~ POST ~ Skipped:', customer);
      return SendResponse(
        { message: 'Customer Already Exists', data: null },
        409
      );
    }
    const createdCustomer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: Number(data.zip_code),
      },
    });
    return SendResponse(
      { message: 'Customers created successfully', data: createdCustomer },
      201
    );
  }
  return SendResponse(
    { message: 'Something went wrong on the server', data: [] },
    500
  );
}
