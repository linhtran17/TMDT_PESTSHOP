const express = require('express');
const productDao = require('../dao/product.dao');
const Product = require("../models/product")
const { Op } = require('sequelize');
const checkRole = require('../middleware/role.mw');

const router = express.Router();

// Tạo sản phẩm mới (Create)
router.post('/', async (req, res) => {
    try {
        const { name, picture, cat_pro, cat_pet, price } = req.body;
        if (!name || !picture || !cat_pro || !cat_pet || !price) {
            return res.status(400).json({ error: 'Thiếu các trường bắt buộc: name, picture, cat_pro, cat_pet, price.' });
        }
        const newProduct = await productDao.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi khi thêm sản phẩm.' });
    }
});

// Lấy danh sách sản phẩm (Read)
router.get('/', async (req, res) => {
    try {
        const data = await productDao.find(req.query)
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
    }
});

// Lấy sản phẩm theo ID (Read by ID)
router.get('/:id', async (req, res) => {
    try {
        const product = await productDao.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm.' });
    }
});

// Cập nhật sản phẩm (Update)
router.put('/:id', async (req, res) => {
    try {
        const { name, picture, cat_pro, cat_pet, price, discount, sale, description } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!name || !cat_pro || !cat_pet || !price) {
            return res.status(400).json({ error: 'Thiếu các trường bắt buộc: name, cat_pro, cat_pet, price.' });
        }

        // Kiểm tra định dạng
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: 'Giá phải là số dương.' });
        }
        if (discount && (isNaN(discount) || discount < 0)) {
            return res.status(400).json({ error: 'Giảm giá phải là số không âm.' });
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }

        // Cập nhật sản phẩm
        product.name = name;
        product.picture = picture || product.picture; // Giữ nguyên ảnh cũ nếu không có ảnh mới
        product.cat_pro = cat_pro;
        product.cat_pet = cat_pet;
        product.price = price;
        product.discount = discount || 0;
        product.sale = sale || 0;
        product.description = description || '';
        await product.save();

        res.json(product);
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm.', details: error.message });
    }
});

// Xóa sản phẩm (Delete)
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.destroy();
            res.status(200).json({ message: 'Xóa sản phẩm thành công.' }); // Trả về JSON với thông báo

        } else {
            res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).json({ error: 'Lỗi khi xóa sản phẩm.' });
    }
});


module.exports = router;
