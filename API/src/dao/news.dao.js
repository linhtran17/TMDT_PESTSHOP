const News = require('../models/news');

async function add(data) {
  console.log('Dữ liệu thêm:', data); // Log để debug
  const { tieude, noidung, hinhanh, published_date, status, description } = data;
  const item = await News.create({ tieude, noidung, hinhanh, published_date, status, description });
  return item;
}

async function find(where, params = {}) {
  let { page = 1, limit = 10 } = params;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  try {
    const items = await News.findAndCountAll({
      where: where || {},
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(items.count / limit);

    return {
      total: items.count,
      totalPages: totalPages,
      currentPage: page,
      list: items.rows,
    };
  } catch (error) {
    console.error('Lỗi khi tìm tin tức:', error);
    return null;
  }
}

async function findById(id) {
  const item = await News.findByPk(id);
  return item;
}

async function update(id, data) {
  console.log('Dữ liệu cập nhật:', { id, data }); // Log để debug
  const { tieude, noidung, hinhanh, published_date, status, description } = data;
  const item = await findById(id);

  if (item) {
    item.tieude = tieude;
    item.noidung = noidung;
    item.hinhanh = hinhanh;
    item.published_date = published_date;
    item.status = status;
    item.description = description;
    await item.save();
    return item;
  }
  return null;
}

async function remove(id) {
  const item = await findById(id);
  if (item) {
    await item.destroy();
    return true;
  }
  return false;
}

module.exports = {
  add,
  find,
  findById,
  update,
  remove,
};