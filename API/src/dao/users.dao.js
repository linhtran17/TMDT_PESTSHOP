const { Op } = require("sequelize");
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_EXPIRES_IN, JWT_SECRET_KEY } = require("../config");

const USER_FIELD = ["id", "username", "email", "role", "last_login", "address"];

function createToken(user) {
  try {
    // Đảm bảo user có các trường cần thiết
    if (!user.id || !user.email) {
      console.error("Invalid user data for token creation:", user);
      return null;
    }

    const data = { id: user.id, email: user.email, role: user?.role || 'customer', username: user?.username };
    if (!JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not defined");
      return null;
    }
    if (!JWT_EXPIRES_IN) {
      console.error("JWT_EXPIRES_IN is not defined");
      return null;
    }

    const token = jwt.sign(data, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.error("Error creating token:", error);
    return null;
  }
}

// Hàm tính toán giờ địa phương
function getLocalTime() {
  const now = new Date();
  const localTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Thêm 7 giờ
  return localTime.toISOString();
}

// Hàm tạo người dùng mới Sign-up
async function create(data) {
  const { username, password, email, role, address } = data;

  // Kiểm tra tất cả các trường bắt buộc theo schema
  if (!username || !email || !password || !address) {
      throw new Error("Vui lòng điền đầy đủ các trường bắt buộc (username, email, password, address).");
  }

  try {
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
          throw new Error("Email đã được sử dụng.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const now = getLocalTime();

      const user = await Users.create({
          username,
          password: hashedPassword,
          email,
          role: role || "customer",
          address,
          create_at: now,
          last_login: now,
      });

      // Chuyển đổi instance Sequelize thành object JavaScript thông thường
      return user.get({ plain: true });
  } catch (error) {
      console.error("Error creating user:", error);
      throw error;
  }
}

// Hàm đăng nhập
async function login(data) {
  const { email, password } = data;
  const user = await Users.findOne({ where: { email: email } });
  if (!user) {
    throw new Error("Email không tồn tại");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Mật khẩu không chính xác");
  }
  const token = createToken(user);
  return { user: user.get({ plain: true }), token };
}

// Hàm tìm kiếm người dùng với phân trang và lọc
async function find(myParams = {}, order = []) {
  let { page = 1, limit = 100 } = myParams;
  page = parseInt(page);
  limit = parseInt(limit);

  const where = {};

  // Bộ lọc theo vai trò (role)
  if (myParams?.role) {
    where.role = myParams.role;
  }

  // Bộ lọc theo tên người dùng (username)
  if (myParams?.username) {
    where.username = { [Op.like]: `%${myParams.username}%` };
  }

  const offset = (page - 1) * limit;
  try {
    const users = await Users.findAndCountAll({
      where,
      limit,
      offset,
      order: order.length ? order : [["id", "ASC"]],
    });

    const totalPages = Math.ceil(users.count / limit);
    return {
      total: users.count,
      totalPages: totalPages,
      currentPage: page,
      list: users.rows.map(user => user.get({ plain: true })), // Chuyển đổi danh sách người dùng
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Hàm tìm người dùng theo ID
async function findById(id) {
  try {
    const user = await Users.findByPk(id, {
      attributes: USER_FIELD,
    });
    return user ? user.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
}

// Hàm tìm người dùng theo email
async function findByEmail(email) {
  const user = await Users.findOne({ where: { email }, attributes: USER_FIELD });
  return user ? user.get({ plain: true }) : null;
}

// Hàm tìm người dùng theo username
async function findByUsername(username) {
  const user = await Users.findOne({ where: { username }, attributes: USER_FIELD });
  return user ? user.get({ plain: true }) : null;
}

// Hàm cập nhật thông tin người dùng
async function update(id, data) {
  const { username, email, role, address } = data;
  const user = await Users.findByPk(id);

  if (user) {
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (address) user.address = address;
    try {
      const now = getLocalTime();
      user.last_login = now;
      await user.save();
      return user.get({ plain: true });
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }
  return null;
}

// Hàm xóa người dùng
async function remove(id) {
  const user = await Users.findByPk(id);
  if (user) {
    try {
      await user.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
  return false;
}

module.exports = {
  create,
  login,
  find,
  findById,
  update,
  remove,
  createToken,
  findByEmail,
  findByUsername
};