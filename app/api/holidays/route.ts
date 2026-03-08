import { NextResponse } from 'next/server';

const CALENDAR_ID = 'en.indian%23holiday%40group.v.calendar.google.com';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const timeMin = `${year}-01-01T00:00:00Z`;
  const timeMax = `${year}-12-31T23:59:59Z`;
  
  const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'http://localhost:3000/',
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) {
        const errorData = await res.json();
        return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    const map: Record<string, string> = {};
    
    if (data.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items.forEach((item: any) => {
        if (item.start?.date) {
          map[item.start.date] = item.summary;
        }
      });
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error('Holiday API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch holidays' }, { status: 500 });
  }
}
