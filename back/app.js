const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services')); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`API de Brillo y Estilo corriendo en http://localhost:${PORT}`);
});