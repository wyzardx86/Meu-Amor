document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Carousel & Post
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
  const toast = document.getElementById('toast');

  // DOM Elements - Real Audio Player
  const audio = document.getElementById('audioPlayer');
  const musicCard = document.getElementById('musicCard');
  const mainPlayBtn = document.getElementById('mainPlayBtn');
  const vinylBtn = document.getElementById('vinylBtn');
  const playSvg = document.getElementById('playSvg');
  const pauseSvg = document.getElementById('pauseSvg');
  const vinylDisc = document.getElementById('vinylDisc');
  const soundWave = document.getElementById('soundWave');
  const progressBar = document.getElementById('progressBar');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const currentTimeEl = document.getElementById('currentTime');
  const durationTimeEl = document.getElementById('durationTime');
  const tickerText = document.getElementById('tickerText');
  const musicHeaderToggle = document.getElementById('musicHeaderToggle');
  const musicBanner = document.getElementById('musicBanner');
  const bannerPlayBtn = document.getElementById('bannerPlayBtn');

  // DOM Elements - Video Clip Modal
  const openClipBtn = document.getElementById('openClipBtn');
  const closeClipBtn = document.getElementById('closeClipBtn');
  const clipModal = document.getElementById('clipModal');
  const clipIframe = document.getElementById('clipIframe');
  const clipVideoUrl = "https://www.youtube.com/embed/5k0bsfK_vlI?autoplay=1";

  let currentSlide = 0;
  const totalSlides = 4;
  let isLiked = false;
  let baseLikes = 999999;
  let isPlaying = false;
  let lyricsInterval = null;

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
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        updateSlide(currentSlide + 1);
      } else {
        updateSlide(currentSlide - 1);
      }
    }
  }, { passive: true });

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
    void bigHeart.offsetWidth;
    bigHeart.classList.add('animate');

    if (!isLiked) {
      setLikedState(true);
    }

    const rect = carousel.getBoundingClientRect();
    const x = e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
    const y = e.clientY ? (e.clientY - rect.top) : (rect.height / 2);
    createMiniHeartsBurst(x, y);

    setTimeout(() => {
      bigHeart.classList.remove('animate');
    }, 700);
  }

  function setLikedState(liked) {
    isLiked = liked;
    if (isLiked) {
      likeBtn.classList.add('liked');
      likesNumber.textContent = (baseLikes + 1).toLocaleString('pt-BR');
      showToast('Você curtiu com todo amor! ❤️');
      if (!isPlaying) playMusic();
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

  // --- FLOATING HEARTS & NOTES BACKGROUND ---
  function createFloatingElement() {
    const el = document.createElement('div');
    el.classList.add('floating-heart');
    const items = ['❤️', '💖', '💕', '💗', '✨', '🌹'];
    const musicalNotes = ['🎵', '🎶', '🎷', '🎹'];
    
    const pool = isPlaying ? items.concat(musicalNotes) : items;
    el.innerText = pool[Math.floor(Math.random() * pool.length)];

    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${0.9 + Math.random() * 1.3}rem`;
    el.style.animationDuration = `${5 + Math.random() * 5}s`;
    el.style.opacity = `${0.25 + Math.random() * 0.45}`;

    heartsContainer.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 10000);
  }

  setInterval(createFloatingElement, 500);
  for (let i = 0; i < 14; i++) {
    createFloatingElement();
  }

  // --- DYNAMIC LYRICS TICKER ---
  const lyricsList = [
    "Quando estou com você, tudo fica mais bonito... ✨",
    "O que era preto e branco fica colorido! 🎨",
    "Quando estou com você sou mais feliz... ❤️",
    "Eu posso dizer que é meu primeiro amor! 💖",
    "E quanto mais o tempo passa, mais feliz eu sou... 🌹",
    "Posso tocar nas estrelas, sorrir por nada... ⭐",
    "E até acreditar que nunca nada vai nos separar... 💍",
    "Não há outra pessoa que me faça sonhar... 💕",
    "Tudo fica mais bonito quando estou com você! 🌹"
  ];
  let lyricIndex = 0;

  function rotateLyrics() {
    tickerText.style.opacity = '0';
    setTimeout(() => {
      lyricIndex = (lyricIndex + 1) % lyricsList.length;
      tickerText.textContent = lyricsList[lyricIndex];
      tickerText.style.opacity = '1';
    }, 400);
  }

  // --- REAL AUDIO ENGINE (HTML5 MP3) ---
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function playMusic() {
    audio.play().then(() => {
      isPlaying = true;
      setPlayVisuals(true);
      musicBanner.classList.add('hidden');
      showToast('🎶 Tocando: Desejo de Menina - Primeiro Amor');
    }).catch(err => {
      console.log("Audio play blocked by browser:", err);
    });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    setPlayVisuals(false);
    showToast('Música pausada');
  }

  function togglePlayMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function setPlayVisuals(active) {
    isPlaying = active;
    musicCard.classList.toggle('playing', active);
    vinylDisc.classList.toggle('spinning', active);
    soundWave.classList.toggle('active', active);
    musicHeaderToggle.classList.toggle('active', active);

    if (active) {
      playSvg.style.display = 'none';
      pauseSvg.style.display = 'block';

      if (!lyricsInterval) {
        lyricsInterval = setInterval(rotateLyrics, 4200);
      }
    } else {
      playSvg.style.display = 'block';
      pauseSvg.style.display = 'none';

      if (lyricsInterval) {
        clearInterval(lyricsInterval);
        lyricsInterval = null;
      }
    }
  }

  // Audio Events
  audio.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const current = audio.currentTime;
    const duration = audio.duration;
    currentTimeEl.textContent = formatTime(current);
    durationTimeEl.textContent = formatTime(duration);
    const percent = (current / duration) * 100;
    progressBar.style.width = `${percent}%`;
  });

  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
  });

  // Progress Bar Seek
  progressBarContainer.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressBarContainer.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = clickRatio * audio.duration;
    if (!isPlaying) playMusic();
  });

  // Play Buttons Listeners
  mainPlayBtn.addEventListener('click', togglePlayMusic);
  vinylBtn.addEventListener('click', togglePlayMusic);
  bannerPlayBtn.addEventListener('click', togglePlayMusic);
  musicHeaderToggle.addEventListener('click', togglePlayMusic);

  // Auto-play on first general touch on page
  function firstInteractionPlay() {
    if (!isPlaying) {
      playMusic();
    }
    document.removeEventListener('click', firstInteractionPlay);
    document.removeEventListener('touchstart', firstInteractionPlay);
  }
  document.addEventListener('click', firstInteractionPlay, { once: true });
  document.addEventListener('touchstart', firstInteractionPlay, { once: true });

  // --- VIDEO CLIP MODAL ---
  openClipBtn.addEventListener('click', () => {
    // Pause background MP3 so they don't overlap
    if (isPlaying) {
      pauseMusic();
    }
    clipIframe.src = clipVideoUrl;
    clipModal.classList.add('open');
  });

  function closeClipModal() {
    clipModal.classList.remove('open');
    clipIframe.src = ""; // Stops video & audio immediately
  }

  closeClipBtn.addEventListener('click', closeClipModal);

  clipModal.addEventListener('click', (e) => {
    if (e.target === clipModal) {
      closeClipModal();
    }
  });

  // --- LOVE LETTER MODAL ---
  openLetterBtn.addEventListener('click', () => {
    letterModal.classList.add('open');
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 22);
    if (!isPlaying) playMusic();
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
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 45);
    showToast('Nosso amor é para sempre! 💑💍');
    setTimeout(() => {
      letterModal.classList.remove('open');
    }, 1200);
  });

  function createHeartExplosion(x, y, count = 25) {
    const symbols = ['❤️', '💖', '💘', '💕', '🥰', '🌹', '✨', '🎵'];
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
