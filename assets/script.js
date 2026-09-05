const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.log-entry').forEach((entry) => {
  entry.addEventListener('toggle', () => {
    if (!entry.open) return;
    document.querySelectorAll('.log-entry[open]').forEach((other) => {
      if (other !== entry) other.open = false;
    });
  });
});

const audio = document.querySelector('.site-audio');
const musicToggle = document.querySelector('.music-toggle');
const musicIcon = musicToggle?.querySelector('span');
const musicStatus = document.querySelector('.music-status');
const volumeSlider = document.querySelector('.volume-slider');
const volumeValue = document.querySelector('.volume-value');

if (audio && musicToggle && volumeSlider && volumeValue && musicStatus && musicIcon) {
  audio.volume = 0.5;

  const updatePlayer = () => {
    const isPlaying = !audio.paused;
    musicIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
    musicToggle.setAttribute('aria-label', `${isPlaying ? 'Pause' : 'Play'} A Sky Full Of Stars`);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicStatus.textContent = isPlaying ? 'Playing' : 'Paused';
  };

  const updateVolume = () => {
    const value = Number(volumeSlider.value);
    audio.volume = value / 100;
    volumeValue.value = `${value}%`;
    volumeValue.textContent = `${value}%`;
    volumeSlider.style.setProperty('--volume-fill', `${value}%`);
  };

  const unlockAutoplay = async (event) => {
    if (!audio.paused || event.target?.closest?.('.music-player')) return;

    try {
      await audio.play();
      updatePlayer();
    } catch (_) {
      musicStatus.textContent = 'Press play';
    }
  };

  const tryAutoplay = async () => {
    try {
      await audio.play();
      updatePlayer();
    } catch (_) {
      updatePlayer();
      musicStatus.textContent = 'Tap anywhere to play';
    }
  };

  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); } catch (_) { musicStatus.textContent = 'Tap again'; }
    } else {
      audio.pause();
    }
    updatePlayer();
  });

  volumeSlider.addEventListener('input', updateVolume);
  audio.addEventListener('play', updatePlayer);
  audio.addEventListener('pause', updatePlayer);
  document.addEventListener('pointerdown', unlockAutoplay, { passive: true });
  document.addEventListener('keydown', unlockAutoplay);
  updateVolume();
  updatePlayer();
  tryAutoplay();
}
