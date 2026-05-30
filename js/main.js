  document.addEventListener('DOMContentLoaded', function() {
            // ========== ANIMACIONES MENÚ ==========
            anime({
                targets: '.logo-container',
                opacity: [0, 1],
                translateX: [-25, 0],
                duration: 700,
                easing: 'easeOutQuad'
            });
            
            anime({
                targets: '.social-icons .social-icon',
                opacity: [0, 1],
                translateY: [-15, 0],
                delay: anime.stagger(60, {start: 300}),
                duration: 500,
                easing: 'easeOutQuad'
            });
            
            anime({
                targets: '#navLinks li',
                opacity: [0, 1],
                translateY: [-15, 0],
                delay: anime.stagger(80, {start: 550}),
                duration: 500,
                easing: 'easeOutQuad'
            });
            
            // ========== CARRUSEL ==========
            const slides = document.querySelectorAll('.carousel-slide');
            const prevBtn = document.getElementById('prevArrow');
            const nextBtn = document.getElementById('nextArrow');
            const pauseBtn = document.getElementById('pauseBtn');
            const pauseIcon = document.getElementById('pauseIcon');
            
            let currentIndex = 0;
            let isPlaying = true;
            let isTransitioning = false;
            let progressValue = 0;
            
            const circumference = 2 * Math.PI * 35;
            const progressCircle = document.querySelector('.progress-ring-circle');
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;
            
            let progressInterval;
            const slideDuration = 8000;
            
            function updateProgress(p) {
                const offset = circumference - (p / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;
            }
            
            function resetProgress() {
                progressValue = 0;
                updateProgress(0);
            }
            
            function startProgressTimer() {
                if (progressInterval) clearInterval(progressInterval);
                const stepTime = 50;
                const stepIncrement = (stepTime / slideDuration) * 100;
                
                progressInterval = setInterval(() => {
                    if (isPlaying && !isTransitioning) {
                        progressValue += stepIncrement;
                        if (progressValue >= 100) {
                            progressValue = 0;
                            updateProgress(0);
                            nextSlide();
                        } else {
                            updateProgress(progressValue);
                        }
                    }
                }, stepTime);
            }
            
            function pauseProgressTimer() {
                if (progressInterval) clearInterval(progressInterval);
            }
            
            function startAutoPlay() {
                isPlaying = true;
                pauseIcon.className = 'fas fa-pause';
                resetProgress();
                startProgressTimer();
            }
            
            function pauseAutoPlay() {
                pauseProgressTimer();
                isPlaying = false;
                pauseIcon.className = 'fas fa-play';
            }
            
            // Animación de entrada de un slide
            function animateSlideIn(slide, direction = 'next') {
                const title = slide.querySelector('.slide-title');
                const description = slide.querySelector('.slide-description');
                const video = slide.querySelector('.slide-video');
                
                // Resetear estados
                anime.set(title, { opacity: 0, translateY: direction === 'next' ? 60 : -60, scale: 0.95 });
                anime.set(description, { opacity: 0, translateY: direction === 'next' ? 40 : -40 });
                anime.set(video, { scale: 1.05 });
                
                // Animación del video
                anime({
                    targets: video,
                    scale: [1.05, 1],
                    duration: 800,
                    easing: 'easeOutCubic'
                });
                
                // Animación del título
                anime({
                    targets: title,
                    opacity: [0, 1],
                    translateY: [direction === 'next' ? 60 : -60, 0],
                    scale: [0.95, 1],
                    duration: 700,
                    delay: 200,
                    easing: 'easeOutElastic(1, 0.6)'
                });
                
                // Animación de la descripción
                anime({
                    targets: description,
                    opacity: [0, 1],
                    translateY: [direction === 'next' ? 40 : -40, 0],
                    duration: 600,
                    delay: 400,
                    easing: 'easeOutQuad'
                });
            }
            
            // Animación de salida de un slide
            function animateSlideOut(slide, direction = 'next') {
                const title = slide.querySelector('.slide-title');
                const description = slide.querySelector('.slide-description');
                const video = slide.querySelector('.slide-video');
                
                return new Promise((resolve) => {
                    anime({
                        targets: title,
                        opacity: [1, 0],
                        translateY: [0, direction === 'next' ? -50 : 50],
                        scale: [1, 0.9],
                        duration: 400,
                        easing: 'easeInQuad'
                    });
                    
                    anime({
                        targets: description,
                        opacity: [1, 0],
                        translateY: [0, direction === 'next' ? -30 : 30],
                        duration: 350,
                        easing: 'easeInQuad'
                    });
                    
                    anime({
                        targets: video,
                        scale: [1, 1.05],
                        duration: 500,
                        easing: 'easeInQuad',
                        complete: () => resolve()
                    });
                });
            }
            
            async function goToSlide(index, direction = 'next') {
                if (isTransitioning) return;
                if (index === currentIndex) return;
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;
                
                isTransitioning = true;
                
                const currentSlide = slides[currentIndex];
                const nextSlide = slides[index];
                
                // Animación de salida del slide actual
                await animateSlideOut(currentSlide, direction);
                
                // Cambiar clases
                currentSlide.classList.remove('active');
                nextSlide.classList.add('active');
                
                // Pausar todos los videos
                document.querySelectorAll('.carousel-slide video').forEach(v => {
                    v.pause();
                    v.currentTime = 0;
                });
                
                // Reproducir video del nuevo slide
                const activeVideo = nextSlide.querySelector('video');
                if (activeVideo) activeVideo.play();
                
                // Animación de entrada del nuevo slide
                animateSlideIn(nextSlide, direction);
                
                currentIndex = index;
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 800);
                
                if (isPlaying) resetProgress();
            }
            
            function nextSlide() {
                if (!isTransitioning) goToSlide(currentIndex + 1, 'next');
            }
            
            function prevSlide() {
                if (!isTransitioning) goToSlide(currentIndex - 1, 'prev');
            }
            
            // Event listeners
            prevBtn.addEventListener('click', () => {
                if (isPlaying) { pauseAutoPlay(); startAutoPlay(); }
                prevSlide();
            });
            
            nextBtn.addEventListener('click', () => {
                if (isPlaying) { pauseAutoPlay(); startAutoPlay(); }
                nextSlide();
            });
            
            pauseBtn.addEventListener('click', () => {
                if (isPlaying) pauseAutoPlay();
                else startAutoPlay();
            });
            
            // Animación inicial del primer slide
            const activeSlide = document.querySelector('.carousel-slide.active');
            const videoInicial = activeSlide.querySelector('video');
            
            anime.set(activeSlide.querySelector('.slide-title'), { opacity: 0, translateY: 60, scale: 0.95 });
            anime.set(activeSlide.querySelector('.slide-description'), { opacity: 0, translateY: 40 });
            
            anime({
                targets: activeSlide.querySelector('.slide-title'),
                opacity: [0, 1],
                translateY: [60, 0],
                scale: [0.95, 1],
                duration: 800,
                delay: 300,
                easing: 'easeOutElastic(1, 0.6)'
            });
            
            anime({
                targets: activeSlide.querySelector('.slide-description'),
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 600,
                delay: 550,
                easing: 'easeOutQuad'
            });
            
            if (videoInicial) videoInicial.play();
            
            // Iniciar autoplay
            startAutoPlay();
            
            // ========== MENÚ HAMBURGUESA ==========
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.getElementById('navLinks');
            
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                if (navLinks.classList.contains('active')) {
                    anime({
                        targets: '#navLinks li',
                        opacity: [0, 1],
                        translateY: [0, 0],
                        delay: anime.stagger(40),
                        duration: 300
                    });
                }
            });
        });

         document.addEventListener('DOMContentLoaded', function() {
        // ========== ANIMACIONES DE ENTRADA MEJORADAS ==========
        const leftSide = document.getElementById('pnfiLeft');
        const rightSide = document.getElementById('pnfiRight');
        const stats = document.querySelectorAll('.stat');
        
        function checkScroll() {
            const rect1 = leftSide.getBoundingClientRect();
            const rect2 = rightSide.getBoundingClientRect();
            
            if (rect1.top < window.innerHeight - 100) {
                leftSide.classList.add('visible');
                // Animar estadísticas después de que el lado izquierdo sea visible
                setTimeout(() => {
                    stats.forEach(stat => stat.classList.add('animated'));
                }, 400);
            }
            if (rect2.top < window.innerHeight - 100) {
                rightSide.classList.add('visible');
            }
        }
        
        window.addEventListener('scroll', checkScroll);
        checkScroll();
        
        // ========== CARRUSEL DE IMÁGENES MANUAL ==========
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');
        const captionTitle = document.querySelector('#imageCaption h3');
        const captionDesc = document.querySelector('#imageCaption p');
        const prevBtn = document.getElementById('prevImage');
        const nextBtn = document.getElementById('nextImage');
        
        let currentIndex = 0;
        let isTransitioning = false;
        
        const imagesData = Array.from(thumbnails).map(thumb => ({
            src: thumb.getAttribute('data-image'),
            title: thumb.getAttribute('data-title'),
            desc: thumb.getAttribute('data-desc')
        }));
        
        function updateImage(index, direction = 'next') {
            if (isTransitioning) return;
            if (index < 0) index = imagesData.length - 1;
            if (index >= imagesData.length) index = 0;
            if (index === currentIndex) return;
            
            isTransitioning = true;
            
            const newImage = imagesData[index];
            
            // Animación de salida más elaborada
            anime({
                targets: '#mainImage',
                opacity: [1, 0],
                scale: [1, 0.92],
                rotateX: [0, 15],
                duration: 350,
                easing: 'easeInQuad'
            });
            
            anime({
                targets: '.image-caption',
                opacity: [1, 0],
                translateY: [0, 30],
                duration: 300,
                easing: 'easeInQuad'
            });
            
            setTimeout(() => {
                mainImage.src = newImage.src;
                captionTitle.textContent = newImage.title;
                captionDesc.textContent = newImage.desc;
                
                thumbnails[currentIndex].classList.remove('active');
                thumbnails[index].classList.add('active');
                
                // Animación de entrada más dinámica
                anime.set('#mainImage', { opacity: 0, scale: 0.92, rotateX: -15 });
                anime.set('.image-caption', { opacity: 0, translateY: -30 });
                
                anime({
                    targets: '#mainImage',
                    opacity: [0, 1],
                    scale: [0.92, 1],
                    rotateX: [-15, 0],
                    duration: 550,
                    easing: 'easeOutElastic(1, 0.7)'
                });
                
                anime({
                    targets: '.image-caption',
                    opacity: [0, 1],
                    translateY: [-30, 0],
                    duration: 450,
                    delay: 250,
                    easing: 'easeOutBack',
                    complete: () => {
                        isTransitioning = false;
                    }
                });
            }, 350);
            
            currentIndex = index;
        }
        
        thumbnails.forEach((thumb, idx) => {
            thumb.addEventListener('click', () => {
                if (idx !== currentIndex) {
                    updateImage(idx, idx > currentIndex ? 'next' : 'prev');
                }
            });
        });
        
        prevBtn.addEventListener('click', () => {
            updateImage(currentIndex - 1, 'prev');
        });
        
        nextBtn.addEventListener('click', () => {
            updateImage(currentIndex + 1, 'next');
        });
        
        // Animación inicial mejorada
        anime.set('#mainImage', { opacity: 0, scale: 0.95, rotateX: -10 });
        anime.set('.image-caption', { opacity: 0, translateY: -20 });
        
        setTimeout(() => {
            anime({
                targets: '#mainImage',
                opacity: [0, 1],
                scale: [0.95, 1],
                rotateX: [-10, 0],
                duration: 900,
                easing: 'easeOutElastic(1, 0.6)'
            });
            anime({
                targets: '.image-caption',
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 700,
                delay: 400,
                easing: 'easeOutBack'
            });
        }, 200);
        
        // Efectos hover mejorados en thumbnails
        thumbnails.forEach(thumb => {
            thumb.addEventListener('mouseenter', () => {
                anime({
                    targets: thumb,
                    scale: 1.05,
                    translateY: -6,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            thumb.addEventListener('mouseleave', () => {
                if (!thumb.classList.contains('active')) {
                    anime({
                        targets: thumb,
                        scale: 1,
                        translateY: 0,
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
        
        // Efecto de brillo en botones al hacer hover
        const controls = document.querySelectorAll('.carousel-control-luxury');
        controls.forEach(control => {
            control.addEventListener('mouseenter', () => {
                anime({
                    targets: control,
                    scale: 1.12,
                    rotate: [0, 360],
                    duration: 500,
                    easing: 'easeOutQuad'
                });
            });
            control.addEventListener('mouseleave', () => {
                anime({
                    targets: control,
                    scale: 1,
                    rotate: [360, 0],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    });


     document.addEventListener('DOMContentLoaded', function() {
        // ========== ANIMACIÓN DE ENTRADA DEL APARTADO PROYECTOS ==========
        const projectsShowcase = document.getElementById('projectsShowcase');
        const projectsHero = document.getElementById('projectsHero');
        const scrollArrow = document.getElementById('scrollArrow');
        const projectsGrid = document.getElementById('projectsGrid');
        
        // Función para detectar cuando la sección entra en pantalla
        function checkProjectsScroll() {
            if (projectsShowcase) {
                const rect = projectsShowcase.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    projectsShowcase.classList.add('visible-projects');
                    // Activar animación de la portada
                    setTimeout(() => {
                        projectsHero.classList.add('animate-hero');
                    }, 100);
                }
            }
        }
        
        window.addEventListener('scroll', checkProjectsScroll);
        checkProjectsScroll();
        
        // ========== SCROLL SUAVE AL HACER CLICK EN LA FLECHA ==========
        if (scrollArrow) {
            scrollArrow.addEventListener('click', function(e) {
                e.preventDefault();
                if (projectsGrid) {
                    const gridPosition = projectsGrid.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: gridPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
        
        // ========== CONTROL DE VIDEOS (pausar cuando no están visibles) ==========
        const videos = document.querySelectorAll('.card-video video');
        
        function checkVideoVisibility() {
            videos.forEach(video => {
                const rect = video.closest('.project-card').getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    video.play().catch(e => console.log('Video autoplay prevented'));
                } else {
                    video.pause();
                }
            });
        }
        
        window.addEventListener('scroll', checkVideoVisibility);
        checkVideoVisibility();
        
        // ========== EFECTO PARALLAX EN VIDEOS ==========
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const video = card.querySelector('.card-video video');
            if (video) {
                card.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const moveX = (x / rect.width - 0.5) * 15;
                    video.style.transform = `scale(1.05) translateX(${moveX}px)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    video.style.transform = 'scale(1) translateX(0)';
                });
            }
        });
        
        // ========== ANIMACIÓN DE SKILLS AL HOVER ==========
        const skills = document.querySelectorAll('.card-skills span');
        skills.forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                anime({
                    targets: skill,
                    scale: [1, 1.1],
                    backgroundColor: ['rgba(211,47,47,0.2)', 'rgba(211,47,47,0.5)'],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            skill.addEventListener('mouseleave', () => {
                anime({
                    targets: skill,
                    scale: [1.1, 1],
                    backgroundColor: ['rgba(211,47,47,0.5)', 'rgba(211,47,47,0.2)'],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
        
        // ========== ANIMACIÓN DE TARJETAS AL HOVER CON ANIME.JS ==========
        projectCards.forEach(card => {
            const content = card.querySelector('.card-content');
            const line = card.querySelector('.card-line');
            
            card.addEventListener('mouseenter', () => {
                if (content) {
                    anime({
                        targets: content,
                        translateY: [-10, 0],
                        duration: 400,
                        easing: 'easeOutQuad'
                    });
                }
                if (line) {
                    anime({
                        targets: line,
                        width: [50, 80],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (content) {
                    anime({
                        targets: content,
                        translateY: [0, 0],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
                if (line) {
                    anime({
                        targets: line,
                        width: [80, 50],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
    });


        document.addEventListener('DOMContentLoaded', function() {
        // ========== ANIMACIÓN DE ENTRADA DEL APARTADO COMPLETO ==========
        const techGallerySection = document.getElementById('techGalleryUnique');
        
        function checkTechGalleryEnter() {
            if (techGallerySection) {
                const rect = techGallerySection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    techGallerySection.classList.add('visible-animation');
                }
            }
        }
        
        window.addEventListener('scroll', checkTechGalleryEnter);
        checkTechGalleryEnter();
        
        // ========== ANIMACIÓN DE PORTAADA ==========
        const portadaUnique = document.getElementById('galleryPortadaUnique');
        const arrowUnique = document.getElementById('portadaArrowUnique');
        
        setTimeout(() => {
            if (portadaUnique) portadaUnique.classList.add('animate-unique');
        }, 200);
        
        // Scroll suave al hacer clic en la flecha
        if (arrowUnique) {
            arrowUnique.addEventListener('click', function(e) {
                e.preventDefault();
                const firstBlock = document.getElementById('block1TechUnique');
                if (firstBlock) {
                    const blockPosition = firstBlock.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: blockPosition - 60, behavior: 'smooth' });
                }
            });
        }
        
        // ========== ANIMACIÓN DE BLOQUES AL SCROLL ==========
        const blocksUnique = document.querySelectorAll('.gallery-block-unique');
        
        function checkBlocksUnique() {
            blocksUnique.forEach((block, index) => {
                const rect = block.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    setTimeout(() => {
                        block.classList.add('visible-unique');
                    }, index * 150);
                }
            });
        }
        
        window.addEventListener('scroll', checkBlocksUnique);
        checkBlocksUnique();
        
        // ========== CARRUSEL PROFESIONAL ==========
        const trackUnique = document.getElementById('carouselTechTrackUnique');
        const slidesUnique = document.querySelectorAll('.carousel-tech-slide-unique');
        const prevBtnUnique = document.getElementById('carouselTechPrevUnique');
        const nextBtnUnique = document.getElementById('carouselTechNextUnique');
        const dotsContainerUnique = document.getElementById('carouselTechDotsUnique');
        
        let currentIndexUnique = 0;
        let slidesPerViewUnique = 4;
        let totalSlidesUnique = slidesUnique.length;
        
        function updateSlidesPerViewUnique() {
            if (window.innerWidth < 768) slidesPerViewUnique = 1;
            else if (window.innerWidth < 1024) slidesPerViewUnique = 2;
            else slidesPerViewUnique = 4;
            updateCarouselUnique();
            createDotsUnique();
        }
        
        function updateCarouselUnique() {
            const slideWidth = slidesUnique[0]?.offsetWidth + 20 || 320;
            const newPosition = -currentIndexUnique * slideWidth;
            if (trackUnique) trackUnique.style.transform = `translateX(${newPosition}px)`;
            updateActiveDotUnique();
        }
        
        function createDotsUnique() {
            if (!dotsContainerUnique) return;
            const totalDots = Math.ceil(totalSlidesUnique / slidesPerViewUnique);
            dotsContainerUnique.innerHTML = '';
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-tech-dot-unique');
                if (i === Math.floor(currentIndexUnique / slidesPerViewUnique)) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndexUnique = i * slidesPerViewUnique;
                    if (currentIndexUnique >= totalSlidesUnique) currentIndexUnique = totalSlidesUnique - slidesPerViewUnique;
                    if (currentIndexUnique < 0) currentIndexUnique = 0;
                    updateCarouselUnique();
                });
                dotsContainerUnique.appendChild(dot);
            }
        }
        
        function updateActiveDotUnique() {
            const dots = document.querySelectorAll('.carousel-tech-dot-unique');
            const activeDotIndex = Math.floor(currentIndexUnique / slidesPerViewUnique);
            dots.forEach((dot, idx) => {
                if (idx === activeDotIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
        
        function nextSlideUnique() {
            if (currentIndexUnique + slidesPerViewUnique < totalSlidesUnique) {
                currentIndexUnique += slidesPerViewUnique;
                updateCarouselUnique();
            } else {
                currentIndexUnique = 0;
                updateCarouselUnique();
            }
        }
        
        function prevSlideUnique() {
            if (currentIndexUnique - slidesPerViewUnique >= 0) {
                currentIndexUnique -= slidesPerViewUnique;
                updateCarouselUnique();
            } else {
                currentIndexUnique = Math.max(0, totalSlidesUnique - slidesPerViewUnique);
                updateCarouselUnique();
            }
        }
        
        if (prevBtnUnique && nextBtnUnique) {
            prevBtnUnique.addEventListener('click', prevSlideUnique);
            nextBtnUnique.addEventListener('click', nextSlideUnique);
        }
        
        window.addEventListener('resize', () => {
            updateSlidesPerViewUnique();
            updateCarouselUnique();
        });
        
        updateSlidesPerViewUnique();
        
        // ========== ANIMACIÓN DE ÍCONOS EN TARJETAS ==========
        const allCardsUnique = document.querySelectorAll('.tech-card-square-unique');
        allCardsUnique.forEach(card => {
            const icon = card.querySelector('.card-icon-unique i');
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        scale: [1, 1.15],
                        duration: 250,
                        easing: 'easeOutQuad'
                    });
                }
            });
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        scale: [1.15, 1],
                        duration: 250,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        // ========== ANIMACIÓN DE ENTRADA DEL APARTADO CONTACTO ==========
        const contactSection = document.getElementById('contactSection');
        const footerSection = document.getElementById('footerProfessional');
        
        function checkContactScroll() {
            // Animación de la sección contacto
            if (contactSection) {
                const rect = contactSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    contactSection.classList.add('visible-contact');
                }
            }
            
            // Animación del footer
            if (footerSection) {
                const rect = footerSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    footerSection.classList.add('visible-footer');
                }
            }
        }
        
        window.addEventListener('scroll', checkContactScroll);
        checkContactScroll();
        
        // ========== SCROLL TO TOP BUTTON ==========
        const scrollBtn = document.getElementById('scrollTopBtnFooter');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // ========== ANIMACIONES HOVER EN TARJETAS ==========
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            const icon = card.querySelector('.info-icon i');
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        scale: [1, 1.15],
                        duration: 250,
                        easing: 'easeOutQuad'
                    });
                }
            });
            card.addEventListener('mouseleave', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        scale: [1.15, 1],
                        duration: 250,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
        
        // ========== ANIMACIONES HOVER EN REDES SOCIALES ==========
        const socialLinks = document.querySelectorAll('.footer-social a');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            link.addEventListener('mouseenter', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        scale: [1, 1.2],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });
            link.addEventListener('mouseleave', () => {
                if (icon) {
                    anime({
                        targets: icon,
                        scale: [1.2, 1],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
        
        // ========== ANIMACIÓN DEL BOTÓN SCROLL TOP ==========
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('mouseenter', () => {
                anime({
                    targets: scrollTopBtn,
                    scale: [1, 1.1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            scrollTopBtn.addEventListener('mouseleave', () => {
                anime({
                    targets: scrollTopBtn,
                    scale: [1.1, 1],
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        }
    });

       document.addEventListener('DOMContentLoaded', function() {
        // ========== RESPUESTAS DEL CHATBOT (SIN EMOJIS) ==========
        const respuestas = {
            duracion: '<i class="fas fa-hourglass-half"></i> El PNFI en Informática tiene una duración de <strong>4 años</strong>, divididos en Trayectos. Al completar el Trayecto II (2 años) obtienes el título de <strong>Técnico Superior Universitario (TSU) en Informática</strong>, y al completar el Trayecto IV (4 años) obtienes el título de <strong>Ingeniero en Informática</strong>.',
            
            requisitos: '<i class="fas fa-file-alt"></i> Los requisitos generales son:<br>• Título de bachiller<br>• Haber aprobado la OPSU<br>• Documentos: cédula, notas, partida de nacimiento<br>• Completar el proceso de inscripción<br><br><i class="fas fa-info-circle"></i> No se requiere conocimiento previo en programación.',
            
            materias: '<i class="fas fa-book"></i> A lo largo de la carrera verás:<br>• Programación (Python, Java, JavaScript)<br>• Bases de Datos (SQL, MongoDB)<br>• Redes y Conectividad<br>• Sistemas Operativos<br>• Desarrollo Web<br>• Estructuras de Datos<br>• Ingeniería de Software<br>• Seguridad Informática<br>• Proyectos Socio-tecnológicos',
            
            salidas: '<i class="fas fa-briefcase"></i> Podrás trabajar como:<br>• Desarrollador de Software<br>• Administrador de Bases de Datos<br>• Ingeniero de Redes<br>• Especialista en Ciberseguridad<br>• Consultor Tecnológico<br>• Desarrollador Web/Móvil<br>• Emprender tus propios proyectos tecnológicos',
            
            software: '<i class="fas fa-laptop-code"></i> No es necesario! La carrera está diseñada para comenzar desde <strong>cero</strong>. Aprenderás desde lo más básico hasta niveles avanzados. Lo importante es tener interés y dedicación. Las materias iniciales te enseñarán los fundamentos.',
            
            titulos: '<i class="fas fa-graduation-cap"></i> Obtienes <strong>dos títulos</strong>:<br>• <strong>Técnico Superior Universitario (TSU) en Informática</strong> - al completar 2 años<br>• <strong>Ingeniero en Informática</strong> - al completar los 4 años completos',
            
            horario: '<i class="fas fa-calendar-alt"></i> El horario es generalmente:<br>• Turno Mañana: 7:00 AM - 1:00 PM<br>• Turno Tarde: 1:00 PM - 6:00 PM<br><br>Depende del trayecto y la sección asignada.',
            
            costo: '<i class="fas fa-money-bill-wave"></i> Sí! Es <strong>completamente gratuito</strong> al ser un programa de educación universitaria pública enmarcado en la Misión Sucre y la Misión Alma Mater. Solo necesitas tus documentos y ganas de estudiar.'
        };
        
        // Elementos del DOM
        const chatbotButton = document.getElementById('chatbotButton');
        const chatbotWindow = document.getElementById('chatbotWindow');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotSend = document.getElementById('chatbotSend');
        const chatbotSelect = document.getElementById('chatbotSelect');
        
        let isOpen = false;
        
        // Abrir/cerrar chat con animación
        function openChat() {
            chatbotWindow.classList.add('active');
            isOpen = true;
            
            anime({
                targets: chatbotWindow,
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.95, 1],
                duration: 400,
                easing: 'easeOutElastic(1, 0.6)'
            });
        }
        
        function closeChat() {
            anime({
                targets: chatbotWindow,
                opacity: [1, 0],
                translateY: [0, 20],
                scale: [1, 0.95],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    chatbotWindow.classList.remove('active');
                    isOpen = false;
                }
            });
        }
        
        chatbotButton.addEventListener('click', openChat);
        chatbotClose.addEventListener('click', closeChat);
        
        // Agregar mensaje al chat
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            
            if (isUser) {
                messageDiv.innerHTML = `
                    <div class="message-bubble">
                        <p>${text}</p>
                        <span class="message-time">Ahora</span>
                    </div>
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-bubble">
                        <p>${text}</p>
                        <span class="message-time">Ahora</span>
                    </div>
                `;
            }
            
            chatbotMessages.appendChild(messageDiv);
            
            anime({
                targets: messageDiv,
                opacity: [0, 1],
                translateY: [15, 0],
                duration: 400,
                easing: 'easeOutQuad'
            });
            
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        // Mostrar typing indicator
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot typing-message';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-bubble">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            chatbotMessages.appendChild(typingDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            anime({
                targets: '.typing-dots span',
                opacity: [0, 1, 0],
                delay: anime.stagger(200),
                loop: true,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
        
        function removeTyping() {
            const typing = document.getElementById('typingIndicator');
            if (typing) typing.remove();
        }
        
        // Procesar pregunta y dar respuesta
        function processQuestion(questionKey) {
            const respuesta = respuestas[questionKey];
            if (respuesta) {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addMessage(respuesta, false);
                }, 800);
            } else {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addMessage('<i class="fas fa-exclamation-triangle"></i> Lo siento, no tengo información sobre eso. Por favor selecciona una de las preguntas del menú o consulta con nuestra oficina de admisiones.', false);
                }, 800);
            }
        }
        
        // Evento para el select dropdown
        chatbotSelect.addEventListener('change', function() {
            const questionKey = this.value;
            if (questionKey) {
                const selectedOption = this.options[this.selectedIndex];
                let questionText = selectedOption.text;
                // Limpiar el texto de los iconos visibles
                questionText = questionText.replace(/[🔧⚙️💻📘]/g, '');
                addMessage(questionText.trim(), true);
                processQuestion(questionKey);
                this.value = '';
            }
        });
        
        // Evento para enviar mensaje personalizado
        function sendCustomMessage() {
            const text = chatbotInput.value.trim();
            if (text === '') return;
            
            addMessage(text, true);
            chatbotInput.value = '';
            
            let found = false;
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('duración') || lowerText.includes('dura') || lowerText.includes('años')) {
                processQuestion('duracion'); found = true;
            } else if (lowerText.includes('requisito') || lowerText.includes('necesito') || lowerText.includes('documentos')) {
                processQuestion('requisitos'); found = true;
            } else if (lowerText.includes('materia') || lowerText.includes('asignatura') || lowerText.includes('ver')) {
                processQuestion('materias'); found = true;
            } else if (lowerText.includes('trabajo') || lowerText.includes('empleo') || lowerText.includes('salida')) {
                processQuestion('salidas'); found = true;
            } else if (lowerText.includes('programar') || lowerText.includes('saber') || lowerText.includes('experiencia')) {
                processQuestion('software'); found = true;
            } else if (lowerText.includes('título') || lowerText.includes('titulo') || lowerText.includes('grado')) {
                processQuestion('titulos'); found = true;
            } else if (lowerText.includes('horario') || lowerText.includes('turno')) {
                processQuestion('horario'); found = true;
            } else if (lowerText.includes('costo') || lowerText.includes('gratis') || lowerText.includes('pagar')) {
                processQuestion('costo'); found = true;
            }
            
            if (!found) {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addMessage('<i class="fas fa-lightbulb"></i> Te recomiendo seleccionar una de las preguntas del menú desplegable. Si tu duda es más específica, contáctanos directamente en nuestra oficina de admisiones. Estamos para ayudarte!', false);
                }, 800);
            }
        }
        
        chatbotSend.addEventListener('click', sendCustomMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendCustomMessage();
        });
        
        // ========== ANIMACIÓN DE ENTRADA DEL BOTÓN ==========
        anime({
            targets: '.chatbot-button',
            scale: [0, 0.55],
            duration: 800,
            easing: 'easeOutElastic(1, 0.6)'
        });
    });