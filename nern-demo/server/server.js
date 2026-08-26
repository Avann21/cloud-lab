const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import Model
const Student = require('./models/Student');

// ------------------- ROUTES -------------------

// GET /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new student (có log chi tiết để debug)
app.post('/api/students', async (req, res) => {
  try {
    console.log('📥 Dữ liệu nhận được:', req.body);
    const newStudent = await Student.create(req.body);
    console.log('✅ Thêm thành công:', newStudent);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error('❌ Lỗi chi tiết:', err);
    // Trả về chi tiết lỗi để client hiển thị
    res.status(400).json({ 
      error: err.message,
      details: err.errors || err
    });
  }
});

// PUT update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server hoạt động trên cổng ${PORT}`);
});