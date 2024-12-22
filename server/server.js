const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const categoriesRoutes = require('./routes/categories');
const wishListRoutes = require('./routes/wishlist');
const bannerRoutes = require("./routes/banners");

app.use(cors({
  origin: 'http://localhost:3000', 
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/api/', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/wishlist', wishListRoutes);
app.use("/api/banners", bannerRoutes);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
