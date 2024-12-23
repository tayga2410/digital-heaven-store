const express = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post('/', upload.single('img'), async (req, res) => {
  const { name, displayName, specSchema } = req.body;
  const img = req.file?.filename;

  if (!name || !displayName) {
    return res.status(400).json({ error: 'Fields "name" and "displayName" are required' });
  }

  try {
    const parsedSpecSchema = specSchema ? JSON.parse(specSchema) : [];

    const newCategory = await prisma.category.create({
      data: {
        name,
        displayName,
        img: img || null,
        specSchema: parsedSpecSchema,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ error: 'Failed to create category' });
  }
});


router.put('/:id', upload.single('img'), async (req, res) => {
  const { id } = req.params;
  const { name, displayName, specSchema } = req.body;
  const img = req.file ? req.file.filename : undefined;

  try {
    const data = { name, displayName };
    if (img) data.img = img;
    if (specSchema) data.specSchema = JSON.parse(specSchema);

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(500).json({ error: 'Failed to update category' });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;