require('dotenv').config();

const express = require('express');
const sequelize = require('./src/config/database'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const rekomendasiRoutes = require('./src/routes/rekomendasi.route');
const authRoutes = require('./src/routes/auth.route');

app.use('/api', rekomendasiRoutes);
app.use('/api/auth', authRoutes);


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Terhubung ke database MySQL!');
    
    await sequelize.sync();
    console.log('🔄 Semua model telah disinkronkan dengan database.');
    app.listen(PORT, () => {
      console.log(`🚀 Server berhasil berjalan di http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);   }
}

startServer();