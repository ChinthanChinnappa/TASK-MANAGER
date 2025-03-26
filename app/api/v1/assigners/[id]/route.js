import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/assigners/{id} - Get Assigner Details
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    const assigner = await prisma.assigner.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!assigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assigner, { status: 200 });
  } catch (error) {
    console.error('Error fetching assigner:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to fetch assigner' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/assigners/{id} - Update Assigner
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, email } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // Check if assigner exists
    const existingAssigner = await prisma.assigner.findUnique({
      where: { id }
    });

    if (!existingAssigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    // Check if email is already in use by another assigner
    if (email !== existingAssigner.email) {
      const emailInUse = await prisma.assigner.findUnique({
        where: { email }
      });

      if (emailInUse) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // Update assigner
    const updatedAssigner = await prisma.assigner.update({
      where: { id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      ...updatedAssigner,
      message: 'Assigner updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating assigner:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to update assigner' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/assigners/{id} - Delete Assigner
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    // Check if assigner exists and get their tasks
    const existingAssigner = await prisma.assigner.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    if (!existingAssigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    // Check if all tasks are completed
    const incompleteTasks = existingAssigner.tasks.filter(task => task.status !== 'completed');
    
    if (incompleteTasks.length > 0) {
      return NextResponse.json(
        { 
          error: 'Bad Request', 
          message: `Cannot delete assigner. They still have ${incompleteTasks.length} incomplete task(s).` 
        },
        { status: 400 }
      );
    }

    // Use a transaction to delete tasks and assigner
    await prisma.$transaction(async (tx) => {
      // First delete all completed tasks
      await tx.task.deleteMany({
        where: {
          assignerId: id,
          status: 'completed'
        }
      });

      // Then delete the assigner
      await tx.assigner.delete({
        where: { id }
      });
    });

    return NextResponse.json({ 
      status: 'success',
      message: 'Assigner and their completed tasks deleted successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting assigner:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to delete assigner. Please try again.' },
      { status: 500 }
    );
  }
} 