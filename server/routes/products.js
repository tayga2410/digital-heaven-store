const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

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

router.post("/products", async (req, res) => {
  const { name, price, img, category } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: { name, price, img, category },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, img, category } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, img, category },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
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