  const express = require('express');
  const mysql = require('mysql2');
  const bodyParser = require('body-parser');

  const app = express();
  const port = 3001;

  // Middleware
  app.use(bodyParser.json());

  // Tạo kết nối đến MySQL
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Mặc định không có mật khẩu trong XAMPP
    database: 'huydeptrai',
  });

  // Kết nối đến MySQL
  connection.connect((err) => {
    if (err) {
      console.error('Kết nối thất bại: ' + err.stack);
      return;
    }
    console.log('Đã kết nối thành công với MySQL.');
  });

  // Endpoint để ghi dữ liệu cảm biến
  app.post('/api/sensor-data', (req, res) => {
    const { temperature, humidity, concentration } = req.body;
    const sql = 'INSERT INTO sensor_data (temperature, humidity, concentration) VALUES (?, ?, ?)';
    
    connection.query(sql, [temperature, humidity, concentration], (err, result) => {
      if (err) {
        console.error('Lỗi khi ghi dữ liệu: ' + err);
        return res.status(500).json({ error: 'Lỗi khi ghi dữ liệu' });
      }
      res.status(200).json({ message: 'Dữ liệu đã được ghi thành công', id: result.insertId });
    });
  });

  // Khởi động server
  app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
  });

  // Endpoint để lấy dữ liệu cảm biến từ database
app.get('/api/sensor-data', (req, res) => {
  const sql = 'SELECT * FROM sensor_data ORDER BY id DESC LIMIT 50'; // Lấy 50 dữ liệu mới nhất

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dữ liệu: ' + err);
      return res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
    }
    res.status(200).json(results);
  });
});