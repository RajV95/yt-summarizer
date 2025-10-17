import { NextRequest, NextResponse } from "next/server";
import { ChatOllama } from '@langchain/ollama';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export async function POST(request: NextRequest) {
    try {
        const { transcript } = await request.json();
        console.log('Received transcript length:', transcript?.length);

        if (!transcript || transcript.length === 0) {
            return NextResponse.json(
                { error: 'Empty transcript received' },
                { status: 400 }
            );
        }

        const llm = new ChatOllama({
            model: 'llama3.2',
            temperature: 0.3,
            baseUrl: 'http://localhost:11434',
        })

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are an expert at summarizing YouTube video content. 
Create a comprehensive, detailed summary of the following transcript in Markdown format.

Format your response using Markdown with:
- # for the main title
- ## for major sections
- ### for subsections
- **bold** for key points
- - or * for bullet points
- > for important quotes or highlights
- \`code\` for any technical terms or commands

Include:
- Main topics and key points
- Important details and examples
- Logical flow from start to end

Transcript: {transcript}

Detailed Summary (in Markdown):`)
        const outputParser = new StringOutputParser();
        const chain = promptTemplate.pipe(llm).pipe(outputParser);

        const summary = await chain.invoke({ transcript: transcript });
        console.log('Summary generated:', typeof summary, summary?.substring(0, 100));
        return NextResponse.json({ summary });

    } catch (error) {
        console.error('Summarization error:', error);
        return NextResponse.json(
            { error: "Failed to Generate Summary" },
            { status: 500 },
        )
    };
}