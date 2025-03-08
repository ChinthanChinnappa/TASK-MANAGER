import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assigners = await prisma.assigner.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!assigners || assigners.length === 0) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'No assigners found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        data: assigners
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching assigners:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Name and email are required fields' },
        { status: 400 }
      );
    }
    
    const existingAssigner = await prisma.assigner.findUnique({
      where: { email },
    });
    
    if (existingAssigner) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    const newAssigner = await prisma.assigner.create({
      data: {
        name,
        email,
      },
    });
    
    return NextResponse.json(
      {
        assigner_id: newAssigner.id,
        name: newAssigner.name,
        email: newAssigner.email,
        message: 'Assigner created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating assigner:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to create assigner' },
      { status: 500 }
    );
  }
} 