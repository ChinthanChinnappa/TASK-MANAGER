import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/v1/stats/tasks_by_status - Get Tasks Statistics by Status
export async function GET() {
  try {
    const stats = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    if (!stats || stats.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No statistics available' },
        { status: 404 }
      );
    }

    const totalTasks = stats.reduce((acc, curr) => acc + curr._count.id, 0);
    const statsByStatus = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});

    return NextResponse.json({
      stats: {
        pending: statsByStatus.pending || 0,
        in_progress: statsByStatus.in_progress || 0,
        completed: statsByStatus.completed || 0,
        total_tasks: totalTasks
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks by status stats:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 