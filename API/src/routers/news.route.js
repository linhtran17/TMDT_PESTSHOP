const express = require('express');
const { Op } = require('sequelize');
const newDao = require('../dao/news.dao');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: './src/public', // Khớp với thư mục lưu ảnh
  filename: (req, file, cb) => {
    cb(null, `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Vui lòng chọn file ảnh (PNG, JPG, ...)'));
    }
    cb(null, true);
  },
});

// Endpoint upload ảnh chung
router.post('/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file được tải lên' });
  }
  const filename = `/uploads/${req.file.filename}`; // Đường dẫn ảnh
  console.log('Ảnh đã upload:', filename);
  res.json({ filename });
});

// Tạo tin tức mới (Create)
router.post('/', async (req, res) => {
  console.log('Dữ liệu nhận được:', req.body);
  try {
    const { tieude, noidung, hinhanh, published_date, status } = req.body;
    if (!tieude || !noidung || !published_date || !['draft', 'published'].includes(status)) {
      return res.status(400).json({
        error: 'Thiếu hoặc sai định dạng các trường bắt buộc',
        details: { tieude: !tieude, noidung: !noidung, published_date: !published_date, status: !['draft', 'published'].includes(status) }
      });
    }
    if (isNaN(Date.parse(published_date))) {
      return res.status(400).json({ error: 'Ngày xuất bản không hợp lệ' });
    }
    const newNews = await newDao.add(req.body);
    if (newNews) {
      res.status(201).json(newNews);
    } else {
      res.status(400).json({ error: 'Không thể thêm tin tức' });
    }
  } catch (error) {
    console.error('Lỗi khi thêm tin tức:', error);
    res.status(500).json({ error: 'Lỗi khi thêm tin tức', details: error.message });
  }
});

// Lấy danh sách tin tức (Read)
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query?.status) {
      where.status = req.query.status;
    }
    if (req.query?.search) {
      where[Op.or] = [
        { tieude: { [Op.like]: `%${req.query.search}%` } },
      ];
    }
    const newsList = await newDao.find(where, req.query);
    res.json(newsList);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin tức:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tức' });
  }
});

// Lấy tin tức theo ID (Read by ID)
router.get('/:id', async (req, res) => {
  try {
    const news = await newDao.findById(req.params.id);
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ error: 'Không tìm thấy tin tức' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy tin tức:', error);
    res.status(500).json({ error: 'Lỗi khi lấy tin tức' });
  }
});

// Cập nhật tin tức (Update)
router.put('/:id', async (req, res) => {
  console.log('Dữ liệu nhận được:', req.body);
  try {
    const { tieude, noidung, hinhanh, published_date, status } = req.body;
    if (!tieude || !noidung || !published_date || !['draft', 'published'].includes(status)) {
      return res.status(400).json({
        error: 'Thiếu hoặc sai định dạng các trường bắt buộc',
        details: { tieude: !tieude, noidung: !noidung, published_date: !published_date, status: !['draft', 'published'].includes(status) }
      });
    }
    if (isNaN(Date.parse(published_date))) {
      return res.status(400).json({ error: 'Ngày xuất bản không hợp lệ' });
    }
    const news = await newDao.update(req.params.id, req.body);
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ error: 'Không tìm thấy tin tức' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật tin tức:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật tin tức', details: error.message });
  }
});

// Xóa tin tức (Delete)
router.delete('/:id', async (req, res) => {
  try {
    const success = await newDao.remove(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Không tìm thấy tin tức' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa tin tức:', error);
    res.status(500).json({ error: 'Lỗi khi xóa tin tức' });
  }
});

module.exports = router;