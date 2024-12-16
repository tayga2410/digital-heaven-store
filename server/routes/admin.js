const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @route GET /api/admin/users
 * @desc Get a list of all users
 * @access Superadmin only
 */
router.get('/users', authenticate, authorize(['superadmin']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


/**
 * @route PATCH /api/admin/users/:id/role
 * @desc Update a user's role
 * @access Superadmin only
 */
router.patch('/users/:id/role', authenticate, authorize(['superadmin']), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'editor'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    console.error('Error updating user role:', err.message);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @desc Delete a user
 * @access Superadmin only
 */
router.delete('/users/:id', authenticate, authorize(['superadmin']), async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
