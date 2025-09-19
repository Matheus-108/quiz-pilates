import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value, email } = body;

    if (!value || !email) {
      return NextResponse.json({ error: 'Value and email are required' }, { status: 400 });
    }

    const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 47290|lT2mwn2QEObmPqwDMv9quB4ZSred60bl8jZjyx0M1fdacf7c',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: value, // Value in cents
        // webhook_url: 'YOUR_WEBHOOK_URL' // Optional: if you have a webhook
      }),
    });

    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch (e) {
            errorBody = await response.text();
        }
      console.error('PushInPay API Error:', errorBody);
      const errorMessage = (typeof errorBody === 'object' && errorBody?.message) ? errorBody.message : 'Failed to create PIX transaction';
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('PIX generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
      }
  
      const response = await fetch(`https://api.pushinpay.com.br/api/transactions/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 47290|lT2mwn2QEObmPqwDMv9quB4ZSred60bl8jZjyx0M1fdacf7c',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 404) {
          return NextResponse.json(null);
      }

      const data = await response.json();
  
      if (!response.ok) {
        return NextResponse.json({ error: data.message || 'Failed to get transaction status' }, { status: response.status });
      }
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('PIX status check error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
