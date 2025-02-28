import { NextResponse } from 'next/server';
import { getAllProfiles } from '@/lib/server-profile';

export async function GET() {
  try {
    const profiles = await getAllProfiles();
    
    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        { profiles: [], message: 'No profiles found' },
        { status: 200 }
      );
    }

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
} 