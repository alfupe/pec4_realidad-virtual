/**
 * PEC4: WebAR Face Tracking - Visor Táctico
 * Lógica de interacción y gestión de estados
 * Estudiante: Alejandro Fuentes Pérez (alfupe@uoc.edu)
 * Universitat Oberta de Catalunya (UOC) - Realidad Virtual
 */

// Controlador del banco de audio Sci-Fi
function initAudioController() {
  const audioTracks = [
    { name: 'Escáner Táctico', el: document.getElementById('audioScan') },
    { name: 'Activación HUD', el: document.getElementById('audioActivate') },
    { name: 'Fijación de Objetivo', el: document.getElementById('audioTarget') }
  ];

  const btnPlaySound = document.getElementById('btnPlaySound');
  const audioTrackName = document.getElementById('audioTrackName');
  const interactiveModel = document.querySelector('.interactivo');
  let currentPlayingAudio = null;
  let lastAudioIndex = -1;

  function resetAudioState() {
    btnPlaySound.classList.remove('hud__btn--playing');
    audioTrackName.textContent = 'En espera';
  }

  function playRandomSound() {
    // Detener audio previo si está en reproducción
    if (currentPlayingAudio) {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
      currentPlayingAudio = null;
    }

    // Selección aleatoria evitando repetir la misma pista consecutiva
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * audioTracks.length);
    } while (randomIndex === lastAudioIndex && audioTracks.length > 1);

    lastAudioIndex = randomIndex;
    const track = audioTracks[randomIndex];
    currentPlayingAudio = track.el;

    btnPlaySound.classList.add('hud__btn--playing');
    audioTrackName.textContent = track.name;

    currentPlayingAudio.play().catch((err) => {
      console.warn('Reproducción de audio bloqueada:', err);
      resetAudioState();
    });

    currentPlayingAudio.onended = () => {
      resetAudioState();
      currentPlayingAudio = null;
    };
  }

  // Evento de clic en el botón de la interfaz
  btnPlaySound.addEventListener('click', playRandomSound);

  // Evento de clic directo sobre el modelo 3D (raycaster)
  if (interactiveModel) {
    interactiveModel.addEventListener('click', (e) => {
      const visorContainer = document.getElementById('visorContainer');
      const isVisible = visorContainer && visorContainer.getAttribute('visible');
      if (isVisible === false || isVisible === 'false') return;

      if (e && e.stopPropagation) e.stopPropagation();
      playRandomSound();
    });
  }
}

// Controlador de visibilidad del visor 3D
function initVisorController() {
  const btnToggleVisor = document.getElementById('btnToggleVisor');
  const visorContainer = document.getElementById('visorContainer');
  const visorModel = document.getElementById('visorModel');
  const visorBtnIcon = document.getElementById('visorBtnIcon');
  const visorBtnLabel = document.getElementById('visorBtnLabel');
  let isVisorVisible = true;

  btnToggleVisor.addEventListener('click', () => {
    isVisorVisible = !isVisorVisible;
    visorContainer.setAttribute('visible', isVisorVisible);
    btnToggleVisor.setAttribute('aria-pressed', (!isVisorVisible).toString());

    // Al ocultar, quitamos la clase interactivo para que el raycaster no lo detecte ni muestre cursor
    if (visorModel) {
      visorModel.classList.toggle('interactivo', isVisorVisible);
    }

    if (isVisorVisible) {
      visorBtnIcon.textContent = '👁️';
      visorBtnLabel.textContent = 'Ocultar Visor';
      btnToggleVisor.classList.remove('hud__btn--hidden');
    } else {
      visorBtnIcon.textContent = '🕶️';
      visorBtnLabel.textContent = 'Mostrar Visor';
      btnToggleVisor.classList.add('hud__btn--hidden');
    }
  });
}

// Controlador de la ventana modal de información
function initModalController() {
  const btnInfoModal = document.getElementById('btnInfoModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const infoModal = document.getElementById('infoModal');

  btnInfoModal.addEventListener('click', () => {
    infoModal.classList.add('hud-modal--active');
  });

  btnCloseModal.addEventListener('click', () => {
    infoModal.classList.remove('hud-modal--active');
  });
}

// Inicialización de controladores al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initAudioController();
  initVisorController();
  initModalController();
});
