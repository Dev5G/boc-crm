import { NextResponse } from 'next/server';

export function SendResponse(
  body: { message: string; data: any },
  status = 200 | 201 | 204 | 409 | 500
) {
  return NextResponse.json({
    status,
    body,
  });
}
