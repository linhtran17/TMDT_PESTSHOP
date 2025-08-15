const { Sequelize } = require('sequelize');

// Khởi tạo kết nối Sequelize với MySQL
const sequelize = new Sequelize('petshop', 'root', 'ABC1234', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
});

// Kiểm tra kết nối
sequelize.authenticate()
    .then(() => {
        console.log('Kết nối thành công với MySQL qua Sequelize!');
    })
    .catch((err) => {
        console.error('Không thể kết nối đến database:', err);
    });

module.exports = sequelize;
