/**
 * PEC4: WebAR Face Tracking - Visor Táctico
 * Lógica de interacción, ciclo de vida AR y telemetría móvil
 * Estudiante: Alejandro Fuentes Pérez (alfupe@uoc.edu)
 * Universitat Oberta de Catalunya (UOC) - Realidad Virtual
 */

// Estado global de la aplicación
let isVisorUserEnabled = true;
let isAudioPlaying = false;
let isFaceDetected = false;

// Observador para garantizar el autoplay y atributos de cámara en dispositivos móviles (Android/iOS)
const videoObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.tagName === 'VIDEO') {
        node.muted = true;
        node.playsInline = true;
        node.setAttribute('playsinline', '');
        node.setAttribute('webkit-playsinline', '');
        node.play().catch((err) => {
          console.warn('WebAR: Autoplay automático de vídeo restringido:', err);
        });
      }
    }
  }
});
videoObserver.observe(document.body, { childList: true });

// Captura de errores globales para telemetría directa en pantalla en móviles
window.addEventListener('error', (event) => {
  console.error('WebAR Error Global:', event.error || event.message);
  const audioTrackName = document.getElementById('audioTrackName');
  if (audioTrackName && !isAudioPlaying) {
    audioTrackName.textContent = 'Err: ' + (event.message || 'Script').substring(0, 24);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('WebAR Rejection:', event.reason);
  const audioTrackName = document.getElementById('audioTrackName');
  if (audioTrackName && !isAudioPlaying) {
    const msg = event.reason?.message || event.reason || 'Rechazo';
    audioTrackName.textContent = 'Err AR: ' + String(msg).substring(0, 24);
  }
});

// Actualiza el indicador inferior según el estado del sistema o del audio
function updateStatusTicker(text) {
  const audioTrackName = document.getElementById('audioTrackName');
  if (audioTrackName && !isAudioPlaying) {
    audioTrackName.textContent = text;
  }
}

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
    isAudioPlaying = false;
    btnPlaySound.classList.remove('hud__btn--playing');
    updateStatusTicker(isFaceDetected ? 'Rostro detectado' : 'Buscando rostro...');
  }

  function playRandomSound() {
    if (currentPlayingAudio) {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
      currentPlayingAudio = null;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * audioTracks.length);
    } while (randomIndex === lastAudioIndex && audioTracks.length > 1);

    lastAudioIndex = randomIndex;
    const track = audioTracks[randomIndex];
    currentPlayingAudio = track.el;

    isAudioPlaying = true;
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

  btnPlaySound.addEventListener('click', playRandomSound);

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

  btnToggleVisor.addEventListener('click', () => {
    isVisorUserEnabled = !isVisorUserEnabled;
    visorContainer.setAttribute('visible', isVisorUserEnabled);
    btnToggleVisor.setAttribute('aria-pressed', (!isVisorUserEnabled).toString());

    if (visorModel) {
      visorModel.classList.toggle('interactivo', isVisorUserEnabled);
    }

    if (isVisorUserEnabled) {
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

// Controlador del ciclo de vida y eventos del sistema AR
function initSceneLifecycleController() {
  const sceneEl = document.querySelector('a-scene');
  const visorModel = document.getElementById('visorModel');

  if (visorModel) {
    visorModel.addEventListener('model-loaded', () => {
      console.log('WebAR: Modelo 3D del visor cargado y listo en la escena');
    });

    visorModel.addEventListener('model-error', (err) => {
      console.error('WebAR: Error al cargar el modelo 3D del visor', err);
      updateStatusTicker('Error modelo 3D');
    });
  }

  if (!sceneEl) return;

  sceneEl.addEventListener('arReady', () => {
    console.log('WebAR: Sistema de visión artificial y tracking facial listos');
    updateStatusTicker('Buscando rostro...');
  });

  sceneEl.addEventListener('targetFound', () => {
    console.log('WebAR: Rostro detectado con éxito');
    isFaceDetected = true;
    updateStatusTicker('Rostro detectado');
  });

  sceneEl.addEventListener('targetLost', () => {
    console.log('WebAR: Rostro fuera de encuadre');
    isFaceDetected = false;
    updateStatusTicker('Buscando rostro...');
  });

  sceneEl.addEventListener('arError', (event) => {
    console.warn('WebAR: Error de inicialización de cámara o soporte', event.detail);
    updateStatusTicker('Cámara no accesible');
  });
}

// Inicialización de controladores al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  if (/Android/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('is-android');
  }
  initAudioController();
  initVisorController();
  initModalController();
  initSceneLifecycleController();
});
