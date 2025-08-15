const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const userDao = require("../dao/users.dao");
const { GOOGLE_CLIENT_ID } = require("../config");

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const USER_FIELD = ["id", "username", "email", "role", "last_login", "address"];

// Hàm kiểm tra định dạng email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Hàm kiểm tra định dạng password
// Sửa để chỉ kiểm tra độ dài, bỏ yêu cầu chữ hoa, chữ thường, số, ký tự đặc biệt
const isValidPassword = (password) => {
    return password.length >= 8 && password.length <= 128;
};

// Hàm kiểm tra định dạng address
// Sửa để chấp nhận mọi ký tự, bỏ kiểm tra ký tự đặc biệt
const isValidAddress = (address) => {
    return true;
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra các ràng buộc cho đăng nhập
        if (!email || email.length < 1 || email.length > 255) {
            return res.status(400).json({ error: "Email phải từ 1 đến 255 ký tự và không được để trống." });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Email không đúng định dạng." });
        }
        if (!password || password.length < 8 || password.length > 128) {
            return res.status(400).json({ error: "Mật khẩu phải từ 8 đến 128 ký tự và không được để trống." });
        }

        const { user, token } = await userDao.login(req.body);
        res.status(200).json({ user: _.pick(user, USER_FIELD), token });
    } catch (error) {
        res.status(401).json({ error: error.message || "Lỗi khi đăng nhập." });
    }
};

// Đăng ký
const signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, address } = req.body;

        // Kiểm tra các ràng buộc cho đăng ký
        if (!username || username.length < 1 || username.length > 255) {
            return res.status(400).json({ error: "Username phải từ 1 đến 255 ký tự và không được để trống." });
        }
        if (username.trim() === "") {
            return res.status(400).json({ error: "Không được bỏ trống trường Username." });
        }
        if (!email || email.length < 1 || email.length > 255) {
            return res.status(400).json({ error: "Email phải từ 1 đến 255 ký tự và không được để trống." });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Email không đúng định dạng." });
        }
        if (!password || password.length < 8 || password.length > 128) {
            return res.status(400).json({ error: "Mật khẩu phải từ 8 đến 128 ký tự và không được để trống." });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ error: "Password phải chứa ít nhất một chữ hoa, chữ thường, số và ký tự đặc biệt." });
        }
        if (!confirmPassword || password !== confirmPassword) {
            return res.status(400).json({ error: "Confirm Password không khớp với Password." });
        }
        if (!address || address.trim() === "") {
            return res.status(400).json({ error: "Địa chỉ không được để trống." });
        }
        if (!isValidAddress(address)) {
            return res.status(400).json({ error: "Địa chỉ không hợp lệ, không được chứa ký tự đặc biệt." });
        }

        // Kiểm tra trùng email
        const existingUser = await userDao.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email đã được sử dụng." });
        }

        const user = await userDao.create({ username, email, password, address });
        console.log("Created user:", user); // Log để kiểm tra user
        if (!user) {
            return res.status(400).json({ error: "Không thể tạo người dùng." });
        }

        const token = userDao.createToken(user);
        console.log("Generated token:", token); // Log để kiểm tra token
        if (!token) {
            return res.status(500).json({ error: "Không thể tạo token." });
        }

        res.status(200).json({ 
            user: _.pick(user, USER_FIELD), 
            token, 
            message: "Đăng ký tài khoản thành công" 
        });
    } catch (error) {
        console.error("Signup error:", error); // Log lỗi để debug
        if (error.message === "Email đã được sử dụng.") {
            return res.status(400).json({ error: "Email đã được sử dụng." });
        }
        res.status(500).json({ error: error.message || "Lỗi khi tạo người dùng." });
    }
};

// auth.ctrl.js
const me = async (req, res) => {
    const { id } = req.user;
    if (id) {
        const user = await userDao.findById(id);
        res.status(200).json({ ...user, status: true });
    } else {
        res.status(400).json({ message: "error" });
    }
};

const loginGoogle = async (req, res, next) => {
    const accessToken = req.body['access-token'];
    if (accessToken) {
        const ticket = await client.verifyIdToken({
            idToken: accessToken,
            audience: GOOGLE_CLIENT_ID,
        });

        const { email, username } = ticket.getPayload();
        let user = await userDao.findByEmail(email);

        let updateUser = false;
        if (!user) {
            updateUser = true;
            user = await userDao.create({ email, username: email, role: "customer", address: "", password: "customer" });
        }
        user = user.toJSON();
        const token = userDao.createToken(user);
        delete user.id;
        delete user.password;
        res.status(200).json({ token, user, updateUser, data: ticket.getPayload() });
    } else {
        next(new Error("Access Token is required", { status: 401 }));
    }
};

const updateUserGoogle = async (req, res, next) => {
    const { username, email, address } = req.body;

    if (!username || !email || !address) {
        next(new Error("Invalid data!"));
    }

    let user = await userDao.findByUsername(username);
    if (user) {
        next(new Error("Username is exists!"));
    }
    user = await userDao.findByEmail(email);
    if (!user) {
        next(new Error("Email is not exists!"));
    }

    user = await userDao.update(user.id, { username, email, address });
    const token = userDao.createToken(user);
    res.status(200).json({ user: _.pick(user, USER_FIELD), token });
};

module.exports = {
    me,
    signup,
    login,
    loginGoogle,
    updateUserGoogle,
};