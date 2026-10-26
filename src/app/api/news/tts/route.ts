import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for audio buffers to ensure instantaneous responses
const audioCache = new Map<string, Buffer>();

/**
 * Split text into natural sentence/clause chunks under 180 characters,
 * respecting punctuation boundaries for natural pauses in speech.
 */
function chunkText(text: string, maxLen = 170): string[] {
  const clean = text
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_#`~[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (trimmed.length > maxLen) {
      // Split large sentence by commas or spaces
      const words = trimmed.split(' ');
      for (const w of words) {
        if ((current + ' ' + w).trim().length > maxLen) {
          if (current.trim()) chunks.push(current.trim());
          current = w;
        } else {
          current = current ? `${current} ${w}` : w;
        }
      }
    } else {
      if ((current + ' ' + trimmed).trim().length > maxLen) {
        if (current.trim()) chunks.push(current.trim());
        current = trimmed;
      } else {
        current = current ? `${current} ${trimmed}` : trimmed;
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  // Cap at 15 chunks max (~3-4 minutes of executive brief audio)
  return chunks.slice(0, 15);
}

async function generateSpeechResponse(text: string) {
  if (!text.trim()) {
    return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
  }

  const cacheKey = text.slice(0, 300);
  if (audioCache.has(cacheKey)) {
    const cached = audioCache.get(cacheKey)!;
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': cached.length.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Accept-Ranges': 'bytes',
      },
    });
  }

  const chunks = chunkText(text);
  if (chunks.length === 0) {
    return NextResponse.json({ error: 'No readable speech text' }, { status: 400 });
  }

  // Fetch MP3 chunks concurrently in parallel for sub-second speed
  const fetchPromises = chunks.map(async (chunk) => {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=en&client=tw-ob`;
    try {
      const res = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch (err) {
      console.warn('TTS chunk fetch failed:', err);
    }
    return null;
  });

  const results = await Promise.all(fetchPromises);
  const audioBuffers: Buffer[] = [];
  for (const b of results) {
    if (b && b.length > 0) {
      audioBuffers.push(b);
    }
  }

  if (audioBuffers.length === 0) {
    return NextResponse.json({ error: 'Speech synthesis failed' }, { status: 502 });
  }

  const combinedMp3 = Buffer.concat(audioBuffers);

  // Keep cache bounded to 100 items
  if (audioCache.size > 100) {
    const firstKey = audioCache.keys().next().value;
    if (firstKey) audioCache.delete(firstKey);
  }
  audioCache.set(cacheKey, combinedMp3);

  return new NextResponse(new Uint8Array(combinedMp3), {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': combinedMp3.length.toString(),
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Accept-Ranges': 'bytes',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || '';
    return await generateSpeechResponse(text);
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: 'Internal speech server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text : '';
    return await generateSpeechResponse(text);
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('TTS POST Error:', error);
    return NextResponse.json({ error: 'Internal speech server error' }, { status: 500 });
  }
}
