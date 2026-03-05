import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isAuthed(request: NextRequest): boolean {
  return request.cookies.get('admin_token')?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const group = searchParams.get('group');
  const sort = searchParams.get('sort') || 'created_at.desc';

  let url = `${SUPABASE_URL}/rest/v1/user_feedback?select=*,feedback_groups(title,status)&order=${sort}`;

  if (category && category !== 'all') {
    url += `&category=eq.${category}`;
  }
  if (status && status !== 'all') {
    url += `&status=eq.${status}`;
  }
  if (group === 'ungrouped') {
    url += '&group_id=is.null';
  } else if (group === 'grouped') {
    url += '&group_id=not.is.null';
  }

  const res = await fetch(url, {
    headers: {
      'apikey': SERVICE_KEY!,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });

  if (!res.ok) {
    // Table may not exist yet (mobile migration pending)
    return NextResponse.json([]);
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing feedback id' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_feedback?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_KEY!,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await request.json();

    if (!ids?.length) {
      return NextResponse.json({ error: 'Missing ids' }, { status: 400 });
    }

    const idList = ids.map((id: string) => `"${id}"`).join(',');
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_feedback?id=in.(${idList})`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SERVICE_KEY!,
          'Authorization': `Bearer ${SERVICE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
