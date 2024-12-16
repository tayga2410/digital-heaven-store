const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        Product: true, 
      },
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req, res) => {
    const { name, img } = req.body;
  
    try {
      const category = await prisma.category.create({
        data: {
          name,
          img,
        },
      });
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error.message);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, img } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, img },
    });
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }, 
      });
  
      await prisma.category.delete({
        where: { id },
      });
  
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error.message);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });
  

module.exports = router;
