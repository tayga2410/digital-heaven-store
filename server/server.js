const express = require('express');
const app = express();
const productRoutes = require('./routes/products');

app.use(express.json());
app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('Server is running!');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
