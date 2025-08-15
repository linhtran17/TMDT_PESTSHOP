<template>
    <section id="about" class="about-section">
        <div class="container">
            <div class="contact-form">
                <h2>Liên hệ với chúng tôi</h2>
                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label">Họ và tên(*)</label>
                        <input type="text" class="form-control" id="name" placeholder="Nhập họ và tên" required>
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">Số điện thoại(*)</label>
                        <input type="tel" class="form-control" id="phone" placeholder="Nhập số điện thoại" required>
                    </div>
                    <div class="mb-6">
                        <label for="email" class="form-label">Email(*)</label>
                        <input type="email" class="form-control" id="email" placeholder="Nhập email" required>
                    </div>
                    <div class="mb-3">
                        <label for="message" class="form-label">Nội dung</label>
                        <textarea class="form-control" id="message" rows="2" placeholder="Nhập nội dung"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Gửi</button>
                </form>
            </div>
        </div>

    </section>
</template>

<style lang="scss" scoped>
.about-section {
    background-color: #f4f4f4;
    padding: 50px 0;
    // text-align: center;

    .container {
        width: 80%;
        margin: 0 auto;
        padding: 20px;
    }
}

</style>
