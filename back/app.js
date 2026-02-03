const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../front/views'));

app.use(express.static(path.join(__dirname, '../front/public')));

app.use('/api/auth', require('./routes/auth'));           
app.use('/api/services', require('./routes/services'));   
app.use('/api/appointments', require('./routes/appointments')); 
app.use('/api/staff', require('./routes/staff'));         
app.use('/api/admin', require('./routes/admin'));        

app.get('/login', (req, res) => res.render('auth/login'));
app.get('/register', (req, res) => res.render('auth/register'));
app.get('/cliente/agendar', (req, res) => res.render('cliente/agendar'));
app.get('/', (req, res) => res.render('index'));
app.get('/personal/agenda', (req, res) => res.render('personal/agenda')); 
app.get('/admin/reporte', (req, res) => res.render('admin/reporte'));
app.get('/admin/gestion', (req, res) => res.render('admin/gestion'));
app.get('/cliente/dashboard', (req, res) => res.render('cliente/dashboard'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});