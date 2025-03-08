import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignerId = searchParams.get('assigner_id');
    const status = searchParams.get('status');
    const dueBefore = searchParams.get('due_before');

    // Build where clause based on filters
    const where = {};
    
    if (assignerId) {
      where.assignerId = parseInt(assignerId);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (dueBefore) {
      where.dueDate = {
        lte: new Date(dueBefore)
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assigner: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'No tasks found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: tasks
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/v1/tasks - Create Task
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, status, due_date, assigner_id } = body;

    // Basic validation
    if (!title || !status || !due_date || !assigner_id) {
      return NextResponse.json(
        { 
          error: 'Bad Request',
          message: 'Title, status, due date, and assigner ID are required fields'
        },
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

    // Check if assigner exists
    const assigner = await prisma.assigner.findUnique({
      where: { id: parseInt(assigner_id) }
    });

    if (!assigner) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Assigner not found' },
        { status: 400 }
      );
    }

    // Create task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate: new Date(due_date),
        assignerId: parseInt(assigner_id)
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
      ...newTask,
      message: 'Task created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to create task' },
      { status: 500 }
    );
  }
} 