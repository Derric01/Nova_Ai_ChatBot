import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, generateStreamResponse, ChatMessage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory, stream = false } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Convert timestamps from strings back to Date objects
    const formattedChatHistory: ChatMessage[] = chatHistory 
      ? chatHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      : [];

    if (stream) {
      // Handle streaming response
      try {
        const stream = await generateStreamResponse(message, formattedChatHistory);
        return new NextResponse(stream);
      } catch (error) {
        console.error('Stream API error:', error);
        // Return a readable stream with an error message
        const errorStream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode("I'm sorry, but I'm experiencing technical difficulties. Please try again later."));
            controller.close();
          }
        });
        return new NextResponse(errorStream);
      }
    } else {
      // Handle regular response
      const responseText = await generateResponse(message, formattedChatHistory);
      
      return NextResponse.json({
        response: responseText,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        response: "I'm sorry, but I'm experiencing technical difficulties. Please try again later."
      },
      { status: 200 } // Return 200 even on error to allow the UI to display the error message
    );
  }
}
