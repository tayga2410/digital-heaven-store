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
  const { name, price, categoryId, brandName, specifications, isBestseller, isTrending, discount } = req.body;
  const img = req.file?.filename;

  try {
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const specs = specifications ? JSON.parse(specifications) : [];

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        img,
        brandName: brandName || null,
        specs,
        categoryId,
        isBestseller: isBestseller === 'true',
        isTrending: isTrending === 'true',
        discount: discount ? parseFloat(discount) : 0,
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
  const { name, price, categoryId, brandName, specifications, isBestseller, isTrending, discount } = req.body;
  const img = req.file?.filename;

  try {
    const updatedData = {
      name,
      price: parseFloat(price),
      brandName: brandName || null,
      specs: specifications ? JSON.parse(specifications) : [],
      isBestseller: isBestseller === 'true',
      isTrending: isTrending === 'true',
      ...(img && { img }),
      discount: discount ? parseFloat(discount) : 0,
    };

    if (categoryId) {
      updatedData.categoryId = categoryId;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updatedData,
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

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });
    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error.message);
    res.status(500).json({ error: "Failed to fetch new arrivals" });
  }
});

router.get("/bestsellers", async (req, res) => {
  try {
    const bestsellers = await prisma.product.findMany({
      where: {
        isBestseller: true,
      },
      take: 8,
    });
    res.json(bestsellers);
  } catch (error) {
    console.error("Error fetching bestsellers:", error.message);
    res.status(500).json({ error: "Failed to fetch bestsellers" });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const trending = await prisma.product.findMany({
      where: {
        isTrending: true,
      },
      take: 8,
    });
    res.json(trending);
  } catch (error) {
    console.error("Error fetching trending products:", error.message);
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
});

router.get("/best-offers", async (req, res) => {
  try {
    const bestOffers = await prisma.product.findMany({
      where: {
        discount: {
          gt: 0, 
        },
      },
      orderBy: {
        discount: "desc", 
      },
      take: 10, 
    });
    res.json(bestOffers);
  } catch (error) {
    console.error("Error fetching best offers:", error.message);
    res.status(500).json({ error: "Failed to fetch best offers" });
  }
});


module.exports = router;
