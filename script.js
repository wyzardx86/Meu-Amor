document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const slides = document.getElementById('carouselSlides');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');
  const dots = document.querySelectorAll('.dot');
  const carousel = document.getElementById('carousel');
  const bigHeart = document.getElementById('bigHeart');
  const likeBtn = document.getElementById('likeBtn');
  const likesNumber = document.getElementById('likesNumber');
  const heartsContainer = document.getElementById('heartsContainer');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const letterModal = document.getElementById('letterModal');
  const letterHeartExplosion = document.getElementById('letterHeartExplosion');
  const shareBtn = document.getElementById('shareBtn');
  const commentBtn = document.getElementById('commentBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicPlayer = document.getElementById('musicPlayer');
  const toast = document.getElementById('toast');

  let currentSlide = 0;
  const totalSlides = 4;
  let isLiked = false;
  let baseLikes = 999999;
  let isPlayingMusic = false;

  // --- CAROUSEL SLIDER ---
  function updateSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    slideCounter.textContent = `${currentSlide + 1}/${totalSlides}`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateSlide(currentSlide + 1);
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateSlide(currentSlide - 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlide(index);
    });
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        updateSlide(currentSlide + 1); // Swipe left -> next
      } else {
        updateSlide(currentSlide - 1); // Swipe right -> prev
      }
    }
  }

  // --- DOUBLE CLICK / DOUBLE TAP TO LIKE ---
  let lastTap = 0;
  carousel.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.nav-arrow') || e.target.closest('.carousel-dots')) return;

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 320 && tapLength > 0) {
      triggerDoubleTapLike(e);
      e.preventDefault();
    }
    lastTap = currentTime;
  });

  function triggerDoubleTapLike(e) {
    bigHeart.classList.remove('animate');
    void bigHeart.offsetWidth; // Trigger reflow
    bigHeart.classList.add('animate');

    if (!isLiked) {
      setLikedState(true);
    }

    // Spawn tiny heart particles at click position
    const rect = carousel.getBoundingClientRect();
    const x = e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
    const y = e.clientY ? (e.clientY - rect.top) : (rect.height / 2);
    createMiniHeartsBurst(x, y);

    setTimeout(() => {
      bigHeart.classList.remove('animate');
    }, 700);
  }

  // --- LIKE BUTTON TOGGLE ---
  function setLikedState(liked) {
    isLiked = liked;
    if (isLiked) {
      likeBtn.classList.add('liked');
      likesNumber.textContent = (baseLikes + 1).toLocaleString('pt-BR');
      showToast('Você curtiu com todo amor! ❤️');
    } else {
      likeBtn.classList.remove('liked');
      likesNumber.textContent = baseLikes.toLocaleString('pt-BR');
    }
  }

  likeBtn.addEventListener('click', () => {
    setLikedState(!isLiked);
  });

  function createMiniHeartsBurst(originX, originY) {
    const emojis = ['❤️', '💖', '✨', '💕', '🥰', '💘'];
    for (let i = 0; i < 9; i++) {
      const p = document.createElement('div');
      p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.position = 'absolute';
      p.style.left = `${originX}px`;
      p.style.top = `${originY}px`;
      p.style.fontSize = `${16 + Math.random() * 16}px`;
      p.style.pointerEvents = 'none';
      p.style.zIndex = '30';
      p.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';

      const destX = (Math.random() - 0.5) * 160;
      const destY = -60 - Math.random() * 120;

      carousel.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 900);
    }
  }

  // --- FLOATING HEARTS BACKGROUND ---
  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    const heartIcons = ['❤️', '💖', '💕', '💗', '🤍', '✨'];
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${0.8 + Math.random() * 1.4}rem`;
    heart.style.animationDuration = `${5 + Math.random() * 5}s`;
    heart.style.opacity = `${0.2 + Math.random() * 0.4}`;

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }

  setInterval(createFloatingHeart, 600);
  for (let i = 0; i < 12; i++) {
    createFloatingHeart();
  }

  // --- LOVE LETTER MODAL ---
  openLetterBtn.addEventListener('click', () => {
    letterModal.classList.add('open');
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 20);
  });

  closeLetterBtn.addEventListener('click', () => {
    letterModal.classList.remove('open');
  });

  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
      letterModal.classList.remove('open');
    }
  });

  letterHeartExplosion.addEventListener('click', () => {
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 40);
    showToast('Nosso amor é para sempre! 💑💍');
    setTimeout(() => {
      letterModal.classList.remove('open');
    }, 1200);
  });

  function createHeartExplosion(x, y, count = 25) {
    const symbols = ['❤️', '💖', '💘', '💕', '🥰', '🌹', '✨'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${20 + Math.random() * 24}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '999';
      el.style.transition = 'all 1.2s cubic-bezier(0.1, 0.9, 0.2, 1)';
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 260;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        el.style.transform = `translate(${destX}px, ${destY}px) scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 1300);
    }
  }

  // --- ROMANTIC AUDIO HARMONY (WEB AUDIO API) ---
  let audioCtx = null;
  let melodyInterval = null;

  function playSoftRomanticChime() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    let chordIdx = 0;

    function playNote(freq, time, duration = 1.4) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + duration);
    }

    melodyInterval = setInterval(() => {
      const now = audioCtx.currentTime;
      const chord = chords[chordIdx % chords.length];
      chord.forEach((freq, i) => {
        playNote(freq, now + i * 0.25, 1.6);
      });
      chordIdx++;
    }, 1800);
  }

  function toggleMusic() {
    isPlayingMusic = !isPlayingMusic;
    const waveBars = document.querySelectorAll('.sound-wave span');
    const disc = document.querySelector('.disc-icon');

    if (isPlayingMusic) {
      playSoftRomanticChime();
      disc.classList.add('playing');
      waveBars.forEach(b => b.style.animationPlayState = 'running');
      showToast('🎶 Tocando melodia do nosso amor...');
    } else {
      if (melodyInterval) clearInterval(melodyInterval);
      disc.classList.remove('playing');
      waveBars.forEach(b => b.style.animationPlayState = 'paused');
      showToast('Música pausada');
    }
  }

  musicToggleBtn.addEventListener('click', toggleMusic);
  musicPlayer.addEventListener('click', toggleMusic);

  // --- SHARE & COMMENT TOASTS ---
  shareBtn.addEventListener('click', () => {
    showToast('Compartilhando todo amor do mundo! 💌');
    createHeartExplosion(window.innerWidth / 2, window.innerHeight * 0.7, 15);
  });

  commentBtn.addEventListener('click', () => {
    showToast('Você é o capítulo mais lindo da minha história! 📖✨');
  });

  // --- TOAST HELPER ---
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});
