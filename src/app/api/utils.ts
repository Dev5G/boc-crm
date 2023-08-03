import { NextResponse } from 'next/server';

export function SendPaginatedResponse(
  body: {
    message: string;
    data: any;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
      startCursor: string;
      hasPrevPage: boolean;
    };
  },
  status = 200 | 201 | 204 | 409 | 500
) {
  return NextResponse.json({
    status,
    body,
  });
}

export function SendResponse(
  body: { message: string; data: any },
  status = 200 | 201 | 204 | 409 | 500
) {
  return NextResponse.json({
    status,
    body,
  });
}
