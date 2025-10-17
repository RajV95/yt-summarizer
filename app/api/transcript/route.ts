import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Extract video ID from URL
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)?.[1];
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' }, 
        { status: 400 }
      );
    }

    console.log('Processing video ID:', videoId);

    // Initialize Innertube
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });

    // Get video info
    const video = await youtube.getInfo(videoId);
    
    // Get transcript
    const transcriptData = await video.getTranscript();
    
    if (!transcriptData) {
      return NextResponse.json(
        { error: 'No transcript available for this video' },
        { status: 404 }
      );
    }

    // Extract text from transcript segments
    const segments = transcriptData.transcript.content?.body?.initial_segments;
    
    if (!segments || segments.length === 0) {
      return NextResponse.json(
        { error: 'Transcript is empty or unavailable' },
        { status: 404 }
      );
    }

    const fullTranscript = segments
      .map((segment: any) => segment.snippet?.text || '')
      .filter((text: string) => text.length > 0)
      .join(' ');

    console.log('Transcript extracted, length:', fullTranscript.length);

    return NextResponse.json({ 
      transcript: fullTranscript,
      videoId: videoId
    });

  } catch (error: any) {
    console.error('Transcript extraction error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to extract transcript',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
