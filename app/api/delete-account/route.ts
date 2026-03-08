import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, accessToken } = await req.json();

    console.log('[API] delete-account: calling edge function for user:', userId);

    const res = await fetch('https://gihofdmqjwgkotwxdxms.supabase.co/functions/v1/delete-user-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'user-id': userId,
      },
      body: JSON.stringify({ name: 'Functions' }),
    });

    const text = await res.text();
    console.log('[API] delete-account: edge function response:', res.status, text);

    return NextResponse.json({ status: res.status, body: text });
  } catch (err) {
    console.error('[API] delete-account: error:', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
