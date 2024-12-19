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

router.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
            specSchema: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/products', upload.single('img'), async (req, res) => {
  const { name, price, categoryId, brandName, specifications } = req.body;
  const img = req.file?.filename;

  try {
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { specSchema: true },
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Инициализируем спецификации из specSchema или используем переданные
    let specs = category.specSchema || {};
    if (specifications) {
      try {
        specs = JSON.parse(specifications);
      } catch (err) {
        console.error('Failed to parse specifications:', err);
      }
    }

    // Создаём продукт с индивидуальными спецификациями
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        img,
        brandName: brandName || null,
        specs, // Сохраняем индивидуальные спецификации
        category: {
          connect: { id: categoryId },
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
  const { name, price, categoryId, brandName, specifications } = req.body;
  const img = req.file?.filename;

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { specSchema: true }
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    let specsData = {};
    if (specifications) {
      try {
        specsData = JSON.parse(specifications);
      } catch (parseError) {
        console.error('Failed to parse specifications:', parseError);
      }
    }

    // Обновляем продукт
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        brandName: brandName || null,
        category: { connect: { id: categoryId } },
        ...(img && { img }),
      },
      include: {
        category: {
          select: { name: true, specSchema: true }
        }
      }
    });

    // Если пришли новые спецификации, обновляем их в категории
    if (Object.keys(specsData).length > 0) {
      await prisma.category.update({
        where: { id: categoryId },
        data: { specSchema: specsData }
      });

      // Заново загружаем продукт с обновлённой категорией
      const reloadedProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: { name: true, specSchema: true }
          }
        }
      });
      return res.json(reloadedProduct);
    }

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
