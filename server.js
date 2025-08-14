require('dotenv').config();

const express = require('express');
const sequelize = require('./src/config/database'); 
const User = require('./src/models/user.model');
const Anak = require('./src/models/anak.model');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

User.hasMany(Anak, { foreignKey: 'userId' });
Anak.belongsTo(User, { foreignKey: 'userId' });

const authRoutes = require('./src/routes/auth.route');
const anakRoutes = require('./src/routes/anak.route');
const rekomendasiRoutes = require('./src/routes/rekomendasi.route');

app.use('/api/auth', authRoutes);
app.use('/api/anak', anakRoutes);
app.use('/api', rekomendasiRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
})

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
    process.exit(1); 
  }
}

startServer();