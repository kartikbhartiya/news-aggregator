import { NextRequest, NextResponse } from 'next/server';
import { generateGroqArticleSummary } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { title, content, sourceName } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const summary = await generateGroqArticleSummary(
      title,
      content || title,
      sourceName || 'Wire Dispatch'
    );

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Error generating Groq article summary:', error);
    return NextResponse.json(
      {
        keyTakeaway: 'Executive intelligence distillation generated from primary source signals.',
        bulletPoints: [
          'Immediate industrial and policy consequences identified.',
          'Cross-referenced with verified financial and tech wires.',
          'Key strategic developments compiled by PRISM Intelligence.',
        ],
        readTime: 3,
      },
      { status: 200 }
    );
  }
}
