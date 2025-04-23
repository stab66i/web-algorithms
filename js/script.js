const video = document.querySelector('.video-background');

const swiperText = new Swiper('.swiper',{
    mousewheel: {},
    speed: 1600,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
    }
});

swiperText.on('slideChange', function() {
    gsap.to(video, 1.6, {
        currentTime: (video.duration / (this.slides.length - 1)) * this.realIndex
    })
})