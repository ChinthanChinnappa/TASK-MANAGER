import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/v1/stats/tasks_by_assigner - Get Tasks Statistics by Assigner
export async function GET() {
  try {
    const stats = await prisma.assigner.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            tasks: {
              where: {
                OR: [
                  { status: 'pending' },
                  { status: 'in_progress' },
                  { status: 'completed' }
                ]
              }
            }
          }
        },
        tasks: {
          where: {
            status: 'completed'
          },
          select: {
            id: true
          }
        }
      }
    });

    if (!stats || stats.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No statistics available' },
        { status: 404 }
      );
    }

    const formattedStats = stats.map(stat => ({
      assigner_id: stat.id,
      assigner_name: stat.name,
      total_tasks: stat._count.tasks,
      completed_tasks: stat.tasks.length,
      pending_tasks: stat._count.tasks - stat.tasks.length
    }));

    return NextResponse.json({
      stats: formattedStats
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks by assigner stats:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 