const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed for products" });
  }
});

router.get("products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post('/products', upload.single('img'), async (req, res) => {
  const { name, price, categoryId } = req.body;
  const img = req.file?.filename;

  console.log('Received data:', { name, price, categoryId, img });

  try {
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        img,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});


router.put('/products/:id', upload.single('img'), async (req, res) => {
  const { id } = req.params;
  const { name, price, categoryId } = req.body; 
  const img = req.file?.filename;

  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        category: { connect: { id: categoryId } }, 
        img: img || undefined, 
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
