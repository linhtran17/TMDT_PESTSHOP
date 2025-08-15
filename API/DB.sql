-- Tạo cơ sở dữ liệu nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS petshop;
USE petshop;

-- Bảng CategoryPets (Chỉ có Chó và Mèo)
CREATE TABLE IF NOT EXISTS CategoryPets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 0
);

INSERT INTO CategoryPets (name, status) VALUES
('Chó', 1),
('Mèo', 1);

-- Bảng CategoryProducts
CREATE TABLE IF NOT EXISTS CategoryProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 0,
    cat_pet INT NOT NULL,
    FOREIGN KEY (cat_pet) REFERENCES CategoryPets(id) ON DELETE CASCADE
);

INSERT INTO CategoryProducts (name, status, cat_pet) VALUES
('Thức ăn cho chó', 1, 1),
('Thức ăn cho mèo', 1, 2),
('Phụ kiện cho chó', 1, 1),
('Phụ kiện cho mèo', 1, 2);

-- Bảng Products
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(255) NOT NULL,
    cat_pro INT NOT NULL,
    cat_pet INT NOT NULL,
    price DOUBLE NOT NULL DEFAULT 0,
    discount DOUBLE NOT NULL DEFAULT 0,
    sale INT NOT NULL DEFAULT 0,
    description TEXT,
    FOREIGN KEY (cat_pro) REFERENCES CategoryProducts(id) ON DELETE CASCADE,
    FOREIGN KEY (cat_pet) REFERENCES CategoryPets(id) ON DELETE CASCADE
);

INSERT INTO Products (name, picture, cat_pro, cat_pet, price, discount, sale, description) VALUES
('Hạt Royal Canin cho chó', 'royalcanin_dog.jpg', 1, 1, 500000, 10, 1, 'Thức ăn hạt cho chó con'),
('Hạt Me-O cho mèo', 'meo_cat.jpg', 2, 2, 300000, 5, 1, 'Thức ăn hạt cho mèo trưởng thành'),
('Vòng cổ cho chó', 'vongco_dog.jpg', 3, 1, 150000, 0, 1, 'Vòng cổ có chuông cho chó'),
('Nhà cây cho mèo', 'nhacay_cat.jpg', 4, 2, 800000, 15, 1, 'Nhà cây leo trèo cho mèo vận động');

-- Bảng Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'customer',
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (username, password, email, role) VALUES
('admin', '123456', 'admin@example.com', 'admin'),
('user1', 'password1', 'user1@example.com', 'customer'),
('user2', 'password2', 'user2@example.com', 'customer');

-- Bảng Orders
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    total FLOAT NOT NULL,
    status ENUM('created', 'pending', 'published', 'deliveried', 'cancel') DEFAULT 'created',
    fullname VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    deliveryAddress VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    orderAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deliveryAt DATETIME DEFAULT NULL,
    updateAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pay VARCHAR(255),
    payStatus VARCHAR(255),
    payData TEXT
);

INSERT INTO Orders (username, total, status, fullname, deliveryAddress, phone, email) VALUES
('user1', 650000, 'pending', 'Nguyễn Văn A', '123 Đường ABC, TP.HCM', '0987654321', 'user1@example.com'),
('user2', 950000, 'created', 'Trần Thị B', '456 Đường XYZ, Hà Nội', '0912345678', 'user2@example.com');

-- Bảng OrderDetails
CREATE TABLE IF NOT EXISTS OrderDetails (
    orderId INT NOT NULL,
    productId INT NOT NULL,
    price FLOAT,
    discount FLOAT,
    quantity INT NOT NULL,
    note VARCHAR(255) NOT NULL,
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

INSERT INTO OrderDetails (orderId, productId, price, discount, quantity, note) VALUES
(1, 1, 500000, 10, 1, 'Giao hàng nhanh'),
(1, 3, 150000, 0, 1, 'Gói kỹ sản phẩm'),
(2, 2, 300000, 5, 1, 'Không giao vào chủ nhật'),
(2, 4, 800000, 15, 1, 'Giao trước 12h');

-- Bảng Contacts
CREATE TABLE IF NOT EXISTS Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    content TEXT NOT NULL,
    status TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Contacts (name, email, phone, content) VALUES
('Nguyễn Văn A', 'nguyenvana@gmail.com', '0987654321', 'Hỏi về thức ăn cho chó'),
('Trần Thị B', 'tranthib@gmail.com', '0912345678', 'Cần tư vấn sản phẩm cho mèo');

-- Bảng News
CREATE TABLE IF NOT EXISTS News (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tieude VARCHAR(255) NOT NULL,
    noidung TEXT NOT NULL,
    hinhanh VARCHAR(255),
    published_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    description TEXT
);

INSERT INTO News (tieude, noidung, hinhanh, status, description) VALUES
('Cách chăm sóc chó con mới sinh', 'Nội dung chi tiết về chăm sóc chó con...', 'chamsoc_cho.jpg', 'published', 'Hướng dẫn chăm sóc chó con'),
('Dinh dưỡng cho mèo trưởng thành', 'Nội dung về dinh dưỡng...', 'dinhduong_meo.jpg', 'published', 'Chế độ ăn uống hợp lý cho mèo');









CREATE DATABASE petshop;
USE petshop;

CREATE TABLE CategoryPets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 0
);
INSERT INTO CategoryPets (name, status) VALUES
('Chó', 1),
('Mèo', 1),
('Cá', 1),
('Chim', 1),
('Chuột Hamster', 1);
CREATE TABLE CategoryProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 0,
    cat_pet INT NOT NULL,
    FOREIGN KEY (cat_pet) REFERENCES CategoryPets(id)
);

INSERT INTO CategoryProducts (name, status, cat_pet) VALUES
('Thức ăn', 1, 1), -- Thức ăn cho chó
('Đồ chơi', 1, 2), -- Đồ chơi cho mèo
('Phụ kiện', 1, 3), -- Phụ kiện cho cá
('Lồng', 1, 4), -- Lồng cho chim
('Đệm lót', 1, 5); -- Đệm lót cho chuột hamster
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    content TEXT NOT NULL,
    status TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tieude VARCHAR(255) NOT NULL,
    noidung TEXT NOT NULL,
    hinhanh VARCHAR(255),
    published_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('published', 'draft') NOT NULL DEFAULT 'draft',
    description TEXT
);
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(255) NOT NULL,
    cat_pro INT NOT NULL,
    cat_pet INT NOT NULL,
    price DOUBLE NOT NULL DEFAULT 0,
    discount DOUBLE NOT NULL DEFAULT 0,
    sale INT NOT NULL DEFAULT 0,
    description TEXT,
    FOREIGN KEY (cat_pro) REFERENCES CategoryProducts(id),
    FOREIGN KEY (cat_pet) REFERENCES CategoryPets(id)
);

INSERT INTO products (name, picture, cat_pro, cat_pet, price, discount, sale, description) VALUES
('Thức ăn chó cao cấp', 'thuc_an_cho.jpg', 1, 1, 500000, 50000, 100, 'Thức ăn dinh dưỡng cho mọi giống chó'),
('Bóng đồ chơi mèo', 'do_choi_meo.jpg', 2, 2, 100000, 20000, 50, 'Bóng tương tác cho mèo'),
('Bộ lọc bể cá', 'bo_loc.jpg', 3, 3, 300000, 30000, 20, 'Bộ lọc cho bể cá nhỏ'),
('Lồng chim cao cấp', 'long_chim.jpg', 4, 4, 800000, 100000, 10, 'Lồng rộng rãi cho chim'),
('Đệm lót hamster', 'dem_lot.jpg', 5, 5, 150000, 10000, 30, 'Đệm lót mềm mại cho chuột hamster');
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) DEFAULT 'customer',
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    address TEXT NOT NULL
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    total FLOAT NOT NULL,
    status ENUM('created', 'pending', 'published', 'deliveried', 'cancel') DEFAULT 'created',
    fullname VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    deliveryAddress VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    orderAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deliveryAt DATETIME,
    updateAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pay VARCHAR(255),
    payStatus VARCHAR(255),
    payData TEXT
);
CREATE TABLE OrderDetails (
    orderId INT NOT NULL,
    productId INT NOT NULL,
    price FLOAT,
    discount FLOAT,
    quantity INT NOT NULL,
    note VARCHAR(255) NOT NULL,
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);