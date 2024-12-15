const express = require('express');
const app = express();
const productRoutes = require('./routes/products');
const path = require('path');
const cors = require('cors');

app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use(cors({
    origin: 'http://localhost:3000', 
  }));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
