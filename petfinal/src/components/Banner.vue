<template>
  <div class="slideshow">
    <div class="slides">
      <!-- Banner 1 -->
      <div class="slide active">
        <img src="/src/assets/img/banner01.jpg" alt="Banner 1" />
      </div>
      <!-- Banner 2 -->
      <div class="slide">
        <img src="@/assets/img/Banner-1.png" alt="Banner 2" />
      </div>
      <!-- Banner 3 -->
      <div class="slide">
        <img src="/src/assets/img/banner011.png" alt="Banner 3" />
      </div>
      <!-- Banner 3 -->
      <div class="slide">
        <img src="@/assets/img/banner04.png" alt="Banner 4" />
      </div>
      <!-- Banner 3 -->
      <div class="slide">
        <img src="@/assets/img/banner05.png" alt="Banner 5" />
      </div>
      <!-- Banner 3 -->
      <!-- <div class="slide">
        <img src="@/assets/img/banner06.png" alt="Banner 6" />
      </div> -->
    </div>
    import bannerImage from '/src/assets/img/Banner-1.png';

  </div>
</template>

<script>
export default {
  mounted() {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    showSlide(currentSlide); // Hiển thị slide đầu tiên
    setInterval(nextSlide, 4500); // Chuyển slide mỗi 3 giây
  },
};
</script>

<style lang="scss" scoped>
.slideshow {
  position: relative;
  width: 80%;
  height: 350px;
  overflow: hidden;
  margin: 0 auto;
  padding-top: 20px;
}

.slides {
  display: flex;
  transition: transform 1s ease-in-out;
}

.slide {
  min-width: 100%;
  display: none;
  opacity: 0;
  transform: scale(0.8);
  transition: all 1s ease-in-out;
}

.slide.active {
  display: block;
  opacity: 1;
  transform: scale(1);
}

.slide img {
  width: 100%;
  height: 75%;
  border-radius: 1%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.541);
}
</style>
