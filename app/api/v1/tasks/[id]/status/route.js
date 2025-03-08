import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PATCH /api/v1/tasks/{id}/status - Update Task Status
export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: 'Bad Request',
          message: 'Invalid status. Must be one of: pending, in_progress, completed'
        },
        { status: 400 }
      );
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      );
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assigner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      ...updatedTask,
      message: 'Task status updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to update task status' },
      { status: 500 }
    );
  }
} 