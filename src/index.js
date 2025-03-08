const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/v1/assigners - List all assigners
app.get('/api/v1/assigners', async (req, res) => {
  try {
    const assigners = await prisma.assigner.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!assigners || assigners.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No assigners found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: assigners
    });
  } catch (error) {
    console.error('Error fetching assigners:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// POST /api/v1/assigners - Create a new assigner
app.post('/api/v1/assigners', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name and email are required fields'
      });
    }

    // Check if email already exists
    const existingAssigner = await prisma.assigner.findUnique({
      where: { email },
    });

    if (existingAssigner) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email already in use'
      });
    }

    // Create new assigner
    const newAssigner = await prisma.assigner.create({
      data: {
        name,
        email,
      },
    });

    // Return success response
    return res.status(201).json({
      assigner_id: newAssigner.id,
      name: newAssigner.name,
      email: newAssigner.email,
      message: 'Assigner created successfully'
    });
  } catch (error) {
    console.error('Error creating assigner:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create assigner'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 