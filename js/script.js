function startApp() {
    const intro = document.getElementById('intro');
    const swiper = document.getElementById('swiper');

    gsap.to(intro, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            intro.style.display = 'none';

            swiper.style.display = 'block';
            gsap.fromTo(swiper, 
                { opacity: 0 }, 
                { opacity: 1, duration: 1 }
            );
        }
    });
}
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