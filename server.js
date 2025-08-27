require('dotenv').config();

const express = require('express');
const sequelize = require('./src/config/database');

const User = require('./src/models/user.model');
const Anak = require('./src/models/anak.model');
const Keluarga = require('./src/models/keluarga.model');
const Post = require('./src/models/post.model');
const Reply = require('./src/models/reply.model');
const PostVote = require('./src/models/postVote.model');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

Keluarga.hasMany(User, { foreignKey: 'keluargaId' });
User.belongsTo(Keluarga, { foreignKey: 'keluargaId' });

Keluarga.hasMany(Anak, { foreignKey: 'keluargaId' });
Anak.belongsTo(Keluarga, { foreignKey: 'keluargaId' });

// Relasi Fitur Komunitas
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
const postRoutes = require('./src/routes/post.route');
const replyRoutes = require('./src/routes/reply.route');
const rekomendasiRoutes = require('./src/routes/rekomendasi.route');

app.use('/api/auth', authRoutes);
app.use('/api/anak', anakRoutes);
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
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);
  }
}

startServer();