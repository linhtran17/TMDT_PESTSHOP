<template>
    <main class="introduc">
        <section class="introduction">
            <h2>CỬA HÀNG PHỤ KIỆN ĐỒ ĂN & SPA CHÓ MÈO PET STORE</h2>
            <p class="font">
                    Đồ ăn phụ kiện thú cưng và các phụ kiện tại khu vực Phú Diễn, Bắc Từ Liêm: xem tại <a href="https://www.youtube.com/" target="_blank"><strong>đây</strong></a><br>
                    Spa và chăm sóc thú cưng tại khu vực Phú Diễn, Bắc Từ Liêm: xem tại <a href="https://www.facebook.com/index.php" class="introduction" target="_blank"><strong>đây</strong></a><br>
                    Với nền tảng vững mạnh và đội ngũ nhân sự chuyên nghiệp, tư vấn nhiệt tình. Mega Pet Store đã nhanh chóng phát triển, đến nay Mega Pet Store đã và đang hợp tác đầu tư, tiếp thị và phân phối thành công các mặt hàng kinh doanh về các phụ kiện chó mèo. Cung cấp sỉ và lẻ các loại thức ăn, vật dụng: máng ăn, nhà ngủ, nệm lót, dây dẫn, vòng cổ, quần áo, mỹ phẩm cho chó mèo…<br>
                    Chúng tôi rất mong tiếp tục nhận được sự hợp tác và ủng hộ Quý Đối Tác, Quý Khách hàng trong thời gian tới.<br>
                    Kính chúc Quý vị sức khỏe, thành công!<br>
            </p>
        </section>
        <section id="services">
            <h2>Dịch vụ</h2>
            <ul>
                <li>Chăm sóc thú cưng</li>
                <li>Thức ăn cho thú cưng</li>
                <li>Phụ kiện thú cưng</li>
            </ul>
        </section>
        <section id="contact">
            <h2>Thông tin liên hệ</h2>
            <p>Địa chỉ: Kho Báu, Phú Diễn, Bắc Từ Liêm</p>
            <p>Số điện thoại: 0686868686</p>
        </section>
        <section id="feedback">
            <h2>Đánh giá khách hàng</h2>
            <div class="container">
                <div class="khachhang">
                    <img src="@/assets/img/feedback_filled_icon.png" alt="" class="tinnhan">
                    <img src="@/assets/img/anh1.jpg" alt="Trần Thị Linh" class="name" />
                    <p class="font">Vận chuyển nhanh, hàng chính hãng, lần sau mình sẽ mua lại.</p>
                    <p class="size">Trần Thị Linh, Facebook</p>
                </div>
                <div class="khachhang">
                    <img src="@/assets/img/feedback_filled_icon.png" alt="" class="tinnhan">
                    <img src="@/assets/img/anh2.jpg" alt="Nguyễn Thị Thùy Linh" class="name" />
                    <p class="font">10 điểm chất lượng, rất yêu. Nhân viên chăm sóc rất tận tình.</p>
                    <p class="size">Nguyễn Thị Thùy Linh, Khách hàng</p>
                </div>
                <div class="khachhang">
                    <img src="@/assets/img/feedback_filled_icon.png" alt="" class="tinnhan">
                    <img src="@/assets/img/anh3.jpg" alt="Hà Thanh Nhương" class="name" />
                    <p class="font">Chất lượng tốt, ship siêu nhanh, hỗ trợ dịch vụ cũng rất tốt.</p>
                    <p class="size">Hà Thanh Nhương, Gmail</p>
                </div>
                <div class="khachhang">
                    <img src="@/assets/img/feedback_filled_icon.png" alt="" class="tinnhan">
                    <img src="@/assets/img/anh5.jpg" alt="Nguyễn Thị Nhương" class="name" />
                    <p class="font">Sản phẩm quá đẹp luôn, 10 điểm goyy.</p>
                    <p class="size">Nguyễn Thị Nhương, Khách hàng</p>
                </div>
                <div class="khachhang">
                    <img src="@/assets/img/feedback_filled_icon.png" alt="" class="tinnhan">
                    <img src="@/assets/img/anh4.jpg" alt="Huỳnh Viết Anh Minh" class="name" />
                    <p class="font">Cảm ơn vì đã giao đúng hẹn cho mình.</p>
                    <p class="size">Huỳnh Viết Anh Minh, Instagram</p>
                </div>
                <div class="khachhang">
                    <img src="@/assets/img/feedback_filled_icon.png" alt="" class="tinnhan">
                    <img src="@/assets/img/anh6.jpg" alt="Khách hàng không tên" class="name" />
                    <p class="font">Cảm ơn, 10 điểm nha, 5 sao không có nhưng.</p>
                    <p class="size">Hội cai nghiện số 2, Instagram</p>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}
.introduction {
    position: relative;
}
.introduction p {
    position: relative;
}
.introduction a {
    background-color: #efc8e3;
}
.introduction a:hover {
    color: #f30909;
}
section {
    margin: 20px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h2 {
    color: #d6148c; 
    font-size: 28px; 
    font-weight: bold; 
    margin: 20px 0; 
}
.font {
    font-family: Arial;
    line-height: 3;
}
ul {
    list-style-type: none;
    padding: 0;
}
ul li {
    background: #eee;
    margin: 5px 0;
    padding: 10px;
    border-radius: 4px;
}
.container {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 50px;
    background-image: linear-gradient(180deg, rgb(224, 156, 198), white);
    border: 3px solid rgba(32, 30, 30, 0.1);
}
.khachhang {
    position: relative;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1px solid #ddd;
    border-radius: 10px;
    width: 350px;
    height: 180px;
    margin: 20px;
    margin-top: 50px;
    padding: 3px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, width 0.3s ease, height 0.3s ease, margin 0.3s ease; /* Thêm transition */
}
.khachhang:hover {
    background-color: rgb(241, 109, 182);
    width: 370px;
    height: 250px;
    margin: 10px;
}
.tinnhan {
    top: 0;
    left: 0;
}
.name {
    position: relative;
    width: 70%;
    height: 50%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    border-radius: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.size {
    position: absolute;
    color: #e74c3c;
    font-weight: bold;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: -40%;
    font-size: 12px;
}
.font {
    color: #000000;
    font-size: 15px;
}
.tinnhan {
    position: absolute;
    width: 30px;
    height: 40px;
    padding: 1px;
}
</style>
