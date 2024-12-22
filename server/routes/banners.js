const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.get('/', async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { position: 'asc' },
    });
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error.message);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

router.post('/', upload.single('img'), async (req, res) => {
  const { link, position } = req.body;
  const img = req.file?.filename;

  if (!position || isNaN(position)) {
    return res.status(400).json({ error: 'Position is required and must be a number.' });
  }

  try {
    const newBanner = await prisma.banner.create({
      data: {
        img: img || '',
        link: link || '',
        position: parseInt(position),
      },
    });
    res.status(201).json(newBanner);
  } catch (error) {
    console.error('Error creating banner:', error.message);
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

router.put('/:id', upload.single('img'), async (req, res) => {
  const { id } = req.params;
  const { link, position } = req.body;
  const img = req.file?.filename;

  if (!position || isNaN(position)) {
    return res.status(400).json({ error: 'Position is required and must be a number.' });
  }

  try {
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        img: img || undefined,
        link: link || undefined,
        position: parseInt(position),
      },
    });
    res.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error.message);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.banner.delete({ where: { id } });
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error.message);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

module.exports = router;
