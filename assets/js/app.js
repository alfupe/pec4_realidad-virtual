/**
 * PEC4: WebAR Face Tracking - Scouter Táctico y Objeto 3D Reactivo
 * Lógica de interacción, ciclo de vida AR y control de objetos
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
          console.warn('WebAR: Autoplay de cámara restringido:', err);
        });
      }
    }
  }
});
videoObserver.observe(document.body, { childList: true });

// Actualiza el indicador inferior según el estado del sistema o del audio
function updateStatusTicker(text) {
  const audioTrackName = document.getElementById('audioTrackName');
  if (audioTrackName && !isAudioPlaying) {
    audioTrackName.textContent = text;
  }
}

// Reproductor aleatorio de audio Sci-Fi expuesto globalmente
let triggerRandomSound = () => {};

// Controlador del banco de audio Sci-Fi
function initAudioController() {
  const audioTracks = [
    { name: 'Escáner Táctico', el: document.getElementById('audioScan') },
    { name: 'Activación HUD', el: document.getElementById('audioActivate') },
    { name: 'Fijación de Objetivo', el: document.getElementById('audioTarget') }
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

// Controlador del objeto primitivo 3D reactivo (Cubo rebotador estilo salvapantallas DVD)
function initInteractiveCubeController() {
  const cube = document.getElementById('energyCube');
  if (!cube) return;

  const colorPalette = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#eab308'];
  let currentColorIdx = 0;
  let isFastSpinning = false;
  let spinExtraDegrees = 0;

  // Parámetros de física de rebote en coordenadas de cámara (frustum)
  // En z = -2.2m, calculamos dinámicamente los límites del viewport visible
  let posX = 0.0;
  let posY = 0.0;
  const posZ = -2.2;
  const cubeRadius = 0.14; // mitad del tamaño para colisión exacta con el borde

  // Velocidades en metros por segundo
  let velX = 0.75;
  let velY = 0.55;
  let lastTime = performance.now();

  function triggerBounceEffect() {
    // Al rebotar en un borde: cambia de color automáticamente
    currentColorIdx = (currentColorIdx + 1) % colorPalette.length;
    const newColor = colorPalette[currentColorIdx];
    cube.setAttribute('material', {
      color: newColor,
      roughness: 0.2,
      metalness: 0.8,
      emissive: newColor,
      emissiveIntensity: 0.55
    });
  }

  // Bucle de animación física de rebote por los bordes de la pantalla
  function bouncePhysics(time) {
    const dt = Math.min((time - lastTime) * 0.001, 0.1); // delta time en segundos
    lastTime = time;

    // Calculamos los límites visibles del frustum en la profundidad posZ
    const cameraEl = document.querySelector('a-camera');
    let limitX = 0.95;
    let limitY = 1.45;

    if (cameraEl && cameraEl.components && cameraEl.components.camera) {
      const threeCamera = cameraEl.components.camera.camera;
      if (threeCamera && threeCamera.fov) {
        // Altura visible a distancia |posZ|
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(threeCamera.fov / 2)) * Math.abs(posZ);
        const visibleWidth = visibleHeight * (threeCamera.aspect || (window.innerWidth / window.innerHeight));
        limitX = (visibleWidth / 2) - cubeRadius;
        limitY = (visibleHeight / 2) - cubeRadius;
      }
    }

    // Actualizamos posición según velocidad
    posX += velX * dt;
    posY += velY * dt;

    // Detección y rebote en bordes horizontales (izq / der)
    if (posX >= limitX) {
      posX = limitX;
      velX = -Math.abs(velX);
      triggerBounceEffect();
    } else if (posX <= -limitX) {
      posX = -limitX;
      velX = Math.abs(velX);
      triggerBounceEffect();
    }

    // Detección y rebote en bordes verticales (arriba / abajo)
    if (posY >= limitY) {
      posY = limitY;
      velY = -Math.abs(velY);
      triggerBounceEffect();
    } else if (posY <= -limitY) {
      posY = -limitY;
      velY = Math.abs(velY);
      triggerBounceEffect();
    }

    cube.setAttribute('position', { x: posX, y: posY, z: posZ });

    // Rotación suave continua sobre sus propios ejes + extra de rotación si se ha pulsado
    if (!isFastSpinning) {
      const t = time * 0.001;
      cube.setAttribute('rotation', {
        x: (t * 35) % 360,
        y: (t * 50 + spinExtraDegrees) % 360,
        z: (t * 20) % 360
      });
    }

    requestAnimationFrame(bouncePhysics);
  }
  requestAnimationFrame(bouncePhysics);

  // Interacción táctil / clic: sonido, cambio de color y giro hiperrápido
  cube.addEventListener('click', (e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    // 1. Reproducir sonido Sci-Fi
    triggerRandomSound();

    // 2. Cambio manual de color PBR
    triggerBounceEffect();

    // 3. Impulso extra de velocidad aleatorio tras ser golpeado
    velX = (velX > 0 ? 1 : -1) * (0.65 + Math.random() * 0.35);
    velY = (velY > 0 ? 1 : -1) * (0.50 + Math.random() * 0.30);

    // 4. Giro acelerado instantáneo de 720 grados
    if (isFastSpinning) return;
    isFastSpinning = true;

    const startRot = cube.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    const startTime = performance.now();
    const duration = 750; // ms
    const totalSpin = 720;

    function fastSpin(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      cube.setAttribute('rotation', {
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

  // Ajustar el plano de recorte cercano de la cámara a 0.05 para que nada se corte
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
      console.log('WebAR: Scouter 3D cargado y listo en la escena');
    });

    visorModel.addEventListener('model-error', (err) => {
      console.error('WebAR: Error al cargar el modelo 3D del Scouter', err);
      updateStatusTicker('Error modelo 3D');
    });
  }

  if (!sceneEl) return;

  sceneEl.addEventListener('arReady', () => {
    console.log('WebAR: Sistema de visión artificial y tracking facial listos');
    updateStatusTicker('Buscando rostro...');
    fixCameraNearPlane();
  });

  window.addEventListener('resize', () => {
    setTimeout(fixCameraNearPlane, 200);
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
  initInteractiveCubeController();
  initVisorController();
  initModalController();
  initSceneLifecycleController();
});
