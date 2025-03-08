import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/v1/tasks/{id} - Get Task Details
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assigner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/tasks/{id} - Update Task
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, description, status, due_date } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
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

    // Validate status if provided
    if (status) {
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
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        status: status || undefined,
        dueDate: due_date ? new Date(due_date) : undefined
      },
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
      message: 'Task updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/tasks/{id} - Delete Task
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
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

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 