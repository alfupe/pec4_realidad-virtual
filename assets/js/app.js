/**
 * PEC4: WebAR Face Tracking - Scouter Táctico y Objeto 3D Reactivo
 * Lógica de interacción, ciclo de vida AR y control de objetos
 * Estudiante: Alejandro Fuentes Pérez (alfupe@uoc.edu)
 * Universitat Oberta de Catalunya (UOC) - Realidad Virtual
 */

// Estado global
let isVisorUserEnabled = true;
let isAudioPlaying = false;
let isFaceDetected = false;

// Configuración de atributos de vídeo para móviles
const videoObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.tagName === 'VIDEO') {
        node.muted = true;
        node.playsInline = true;
        node.setAttribute('playsinline', '');
        node.setAttribute('webkit-playsinline', '');
        node.play().catch(() => {});
      }
    }
  }
});
videoObserver.observe(document.body, { childList: true });

// Actualiza el texto de estado inferior
function updateStatusTicker(text) {
  const audioTrackName = document.getElementById('audioTrackName');
  if (audioTrackName && !isAudioPlaying) {
    audioTrackName.textContent = text;
  }
}

let triggerRandomSound = () => {};

// Control de audio Dragon Ball
function initAudioController() {
  const audioTracks = [
    { name: 'Escáner Scouter (Ki)', el: document.getElementById('audioScan') },
    { name: 'Teletransporte (Shunkan Ido)', el: document.getElementById('audioActivate') },
    { name: 'Radar Dragón', el: document.getElementById('audioTarget') }
  ];

  const btnPlaySound = document.getElementById('btnPlaySound');
  const audioTrackName = document.getElementById('audioTrackName');
  const visorModel = document.getElementById('visorModel');
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

  // Asignamos la función para que otros componentes interactivos puedan invocarla
  triggerRandomSound = playRandomSound;

  btnPlaySound.addEventListener('click', playRandomSound);

  if (visorModel) {
    visorModel.addEventListener('click', (e) => {
      const visorContainer = document.getElementById('visorContainer');
      const isVisible = visorContainer && visorContainer.getAttribute('visible');
      if (isVisible === false || isVisible === 'false') return;

      if (e && e.stopPropagation) e.stopPropagation();
      playRandomSound();
    });
  }
}

// Animación y física de la Bola de Dragón interactiva (4 estrellas)
function initInteractiveCubeController() {
  const ball = document.getElementById('energyBall') || document.getElementById('energyCube');
  if (!ball) return;

  let isFastSpinning = false;
  let spinExtraDegrees = 0;

  let posX = 0.0;
  let posY = 0.0;
  const posZ = -2.2;

  let velX = 0.75;
  let velY = 0.55;
  let lastTime = performance.now();

  function triggerBounceEffect() {
    // Destello de energía Ki al rebotar o ser golpeada
    ball.setAttribute('material', {
      src: '#dragonBallTex',
      roughness: 0.12,
      metalness: 0.15,
      emissive: '#ffaa00',
      emissiveIntensity: 0.95
    });
    setTimeout(() => {
      ball.setAttribute('material', 'emissiveIntensity', 0.25);
    }, 280);
  }

  // Rebote continuo en los bordes de la pantalla
  function bouncePhysics(time) {
    const dt = Math.min((time - lastTime) * 0.001, 0.1);
    lastTime = time;

    const winW = window.innerWidth || document.documentElement.clientWidth;
    const winH = window.innerHeight || document.documentElement.clientHeight;
    const screenAspect = winW / winH;

    let visibleHeight3D = 2.6;
    let visibleWidth3D = visibleHeight3D * screenAspect;

    const cameraEl = document.querySelector('a-camera');
    if (cameraEl && cameraEl.components && cameraEl.components.camera) {
      const threeCamera = cameraEl.components.camera.camera;
      if (threeCamera && threeCamera.fov) {
        const fullHeight3D = 2 * Math.tan(THREE.MathUtils.degToRad(threeCamera.fov / 2)) * Math.abs(posZ);
        const cameraAspect = threeCamera.aspect || screenAspect;

        // Ajuste por compensación de recorte en móviles (object-fit: cover)
        if (cameraAspect >= screenAspect) {
          visibleHeight3D = fullHeight3D;
          visibleWidth3D = fullHeight3D * screenAspect;
        } else {
          visibleWidth3D = fullHeight3D * cameraAspect;
          visibleHeight3D = visibleWidth3D / screenAspect;
        }
      }
    }

    // Radio de la esfera (0.16m) para contacto exacto en los 4 bordes
    const ballMargin = 0.16;
    const limitX = Math.max(0.15, (visibleWidth3D / 2) - ballMargin);
    const limitY = Math.max(0.15, (visibleHeight3D / 2) - ballMargin);

    posX += velX * dt;
    posY += velY * dt;

    if (posX >= limitX) {
      posX = limitX;
      velX = -Math.abs(velX);
      triggerBounceEffect();
    } else if (posX <= -limitX) {
      posX = -limitX;
      velX = Math.abs(velX);
      triggerBounceEffect();
    }

    if (posY >= limitY) {
      posY = limitY;
      velY = -Math.abs(velY);
      triggerBounceEffect();
    } else if (posY <= -limitY) {
      posY = -limitY;
      velY = Math.abs(velY);
      triggerBounceEffect();
    }

    ball.setAttribute('position', { x: posX, y: posY, z: posZ });

    if (!isFastSpinning) {
      const t = time * 0.001;
      ball.setAttribute('rotation', {
        x: (t * 35) % 360,
        y: (t * 50 + spinExtraDegrees) % 360,
        z: (t * 20) % 360
      });
    }

    requestAnimationFrame(bouncePhysics);
  }
  requestAnimationFrame(bouncePhysics);

  // Interacción al tocar o hacer clic en la bola de dragón
  ball.addEventListener('click', (e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    triggerRandomSound();
    triggerBounceEffect();

    velX = (velX > 0 ? 1 : -1) * (0.65 + Math.random() * 0.35);
    velY = (velY > 0 ? 1 : -1) * (0.50 + Math.random() * 0.30);

    if (isFastSpinning) return;
    isFastSpinning = true;

    const startRot = ball.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    const startTime = performance.now();
    const duration = 750;
    const totalSpin = 720;

    function fastSpin(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      ball.setAttribute('rotation', {
        x: startRot.x + easeOut * 360,
        y: startRot.y + easeOut * totalSpin,
        z: startRot.z + easeOut * 180
      });

      if (progress < 1) {
        requestAnimationFrame(fastSpin);
      } else {
        spinExtraDegrees += totalSpin;
        isFastSpinning = false;
      }
    }
    requestAnimationFrame(fastSpin);
  });
}

// Controlador de visibilidad del modelo Scouter
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
      visorBtnLabel.textContent = 'Ocultar Scouter';
      btnToggleVisor.classList.remove('hud__btn--hidden');
    } else {
      visorBtnIcon.textContent = '🕶️';
      visorBtnLabel.textContent = 'Mostrar Scouter';
      btnToggleVisor.classList.add('hud__btn--hidden');
    }
  });
}

// Modal de instrucciones
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

// Ciclo de vida y eventos de la escena AR
function initSceneLifecycleController() {
  const sceneEl = document.querySelector('a-scene');
  const visorModel = document.getElementById('visorModel');

  // Ajuste del plano cercano para evitar cortes visuales
  function fixCameraNearPlane() {
    const cameraEl = document.querySelector('a-camera');
    if (cameraEl && cameraEl.components && cameraEl.components.camera) {
      const threeCamera = cameraEl.components.camera.camera;
      if (threeCamera && threeCamera.near !== 0.05) {
        threeCamera.near = 0.05;
        threeCamera.updateProjectionMatrix();
      }
    }
  }

  if (visorModel) {
    visorModel.addEventListener('model-loaded', () => {
      console.log('Scouter 3D cargado');
    });

    visorModel.addEventListener('model-error', (err) => {
      console.error('Error al cargar el modelo 3D', err);
      updateStatusTicker('Error modelo 3D');
    });
  }

  if (!sceneEl) return;

  sceneEl.addEventListener('arReady', () => {
    console.log('Tracking facial listo');
    updateStatusTicker('Buscando rostro...');
    fixCameraNearPlane();
  });

  window.addEventListener('resize', () => {
    setTimeout(fixCameraNearPlane, 200);
  });

  sceneEl.addEventListener('targetFound', () => {
    isFaceDetected = true;
    updateStatusTicker('Rostro detectado');
  });

  sceneEl.addEventListener('targetLost', () => {
    isFaceDetected = false;
    updateStatusTicker('Buscando rostro...');
  });

  sceneEl.addEventListener('arError', (event) => {
    console.warn('Error de cámara o permisos:', event.detail);
    updateStatusTicker('Cámara no accesible');
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (/Android/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('is-android');
  }
  initAudioController();
  initInteractiveCubeController();
  initVisorController();
  initModalController();
  initSceneLifecycleController();
});
