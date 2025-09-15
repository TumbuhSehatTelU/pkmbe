require('dotenv').config();

const express = require('express');
const sequelize = require('./src/config/database');

const { User, Anak, Keluarga, Post, Reply, PostVote, Makanan, RiwayatMakan } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Definisikan Semua Relasi Sequelize ---
Keluarga.hasMany(User, { foreignKey: 'keluargaId' });
User.belongsTo(Keluarga, { foreignKey: 'keluargaId' });

Keluarga.hasMany(Anak, { foreignKey: 'keluargaId' });
Anak.belongsTo(Keluarga, { foreignKey: 'keluargaId' });

Anak.hasMany(RiwayatMakan, { foreignKey: 'anakId' });
RiwayatMakan.belongsTo(Anak, { foreignKey: 'anakId' });

Makanan.hasMany(RiwayatMakan, { foreignKey: 'makananId' });
RiwayatMakan.belongsTo(Makanan, { foreignKey: 'makananId' });

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Reply, { foreignKey: 'userId' });
Reply.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Reply, { foreignKey: 'postId' });
Reply.belongsTo(Post, { foreignKey: 'postId' });

Reply.hasMany(Reply, { as: 'children', foreignKey: 'parentId', onDelete: 'CASCADE' });
Reply.belongsTo(Reply, { as: 'parent', foreignKey: 'parentId' });

User.belongsToMany(Post, { through: PostVote, foreignKey: 'userId' });
Post.belongsToMany(User, { through: PostVote, foreignKey: 'postId' });

const authRoutes = require('./src/routes/auth.route');
const anakRoutes = require('./src/routes/anak.route');
const keluargaRoutes = require('./src/routes/keluarga.route');
const makananRoutes = require('./src/routes/makanan.route');
const postRoutes = require('./src/routes/post.route');
const replyRoutes = require('./src/routes/reply.route');
const rekomendasiRoutes = require('./src/routes/rekomendasi.route');

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/anak', anakRoutes);
app.use('/api/keluarga', keluargaRoutes);
app.use('/api/makanan', makananRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api', rekomendasiRoutes);

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
    console.error('❌ Gagal memulai server:', error);
    process.exit(1);
  }
}

startServer();