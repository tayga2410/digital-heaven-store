const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth'); 
const router = express.Router();

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id; 
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error.message);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await prisma.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
