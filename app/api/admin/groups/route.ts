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

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/feedback_groups?select=*,user_feedback(count)&order=created_at.desc`,
    {
      headers: {
        'apikey': SERVICE_KEY!,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    // Table may not exist yet (mobile migration pending)
    return NextResponse.json([]);
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, feedback_ids } = await request.json();

    if (!title || !feedback_ids?.length) {
      return NextResponse.json(
        { error: 'Title and feedback_ids are required' },
        { status: 400 }
      );
    }

    // Create group
    const createRes = await fetch(
      `${SUPABASE_URL}/rest/v1/feedback_groups`,
      {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY!,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title: title,
          status: 'open',
        }),
      }
    );

    if (!createRes.ok) {
      const text = await createRes.text();
      return NextResponse.json({ error: text }, { status: createRes.status });
    }

    const [group] = await createRes.json();

    // Assign feedback items to the group
    for (const feedbackId of feedback_ids) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/user_feedback?id=eq.${feedbackId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SERVICE_KEY!,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ group_id: group.id }),
        }
      );
    }

    return NextResponse.json(group);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing group id' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/feedback_groups?id=eq.${id}`,
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

    // Propagate admin_response and status to all member feedback items
    const memberUpdates: Record<string, unknown> = {};
    if ('admin_response' in updates) memberUpdates.admin_response = updates.admin_response;
    if ('status' in updates) memberUpdates.status = updates.status;

    if (Object.keys(memberUpdates).length > 0) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/user_feedback?group_id=eq.${id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SERVICE_KEY!,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberUpdates),
        }
      );
    }

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
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing group id' }, { status: 400 });
    }

    // Ungroup all member feedback items first
    await fetch(
      `${SUPABASE_URL}/rest/v1/user_feedback?group_id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_KEY!,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: null }),
      }
    );

    // Delete the group
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/feedback_groups?id=eq.${id}`,
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
