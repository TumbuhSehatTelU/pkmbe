const express =require("express")
const app=express();
const port =3000;

const mysql = require('mysql2/promise'); 
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost', // Ambil dari variabel lingkungan Docker Compose
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'local_password',
  database: process.env.MYSQL_DATABASE || 'test_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
async function connectToDb() {
  try {
    const connection = await pool.getConnection();
    console.log('Terhubung ke database MySQL!');
    connection.release(); 
  } catch (error) {
    console.error('Gagal terhubung ke database:', error);
  }
}
connectToDb();
app.get('/', (req, res) => {
  res.send('Halo! Aplikasi Node.js &  saya sudah berjalan!');
});


app.listen(port, () => {
  console.log(`Server berhasil berjalan di http://localhost:${port}`);
});