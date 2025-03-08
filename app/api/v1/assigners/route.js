import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/v1/assigners - List all assigners
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

// POST /api/v1/assigners - Create a new assigner
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email } = body;
    
    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Name and email are required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingAssigner = await prisma.assigner.findUnique({
      where: { email },
    });
    
    if (existingAssigner) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create new assigner
    const newAssigner = await prisma.assigner.create({
      data: {
        name,
        email,
      },
    });
    
    // Return success response
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