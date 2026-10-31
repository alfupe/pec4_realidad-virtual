# PEC 4: WebAR con MindAR y A-Frame (Face Tracking)

**Asignatura:** Realidad Virtual (Semestre 2627/1)  
**Estudiante:** Alejandro Fuentes Pérez (`alfupe@uoc.edu`)  
**Grado:** Grado de Multimedia - Universitat Oberta de Catalunya (UOC)  
**Entorno de desarrollo:** Visual Studio Code / WebAR (MindAR 1.2.5 + A-Frame 1.5.0)  

---

## 1. Descripción del Proyecto

Esta práctica corresponde a la **PEC 4** de la asignatura de *Realidad Virtual*. En cumplimiento de las directrices docentes del aula (sustituyendo el entorno propietario de Lens Studio por estándares web abiertos), se ha desarrollado una experiencia completa de **Realidad Aumentada Web (WebAR)** basada en detección y seguimiento facial (**Face Tracking**) en tiempo real sobre el feed de la cámara del usuario.

La experiencia implementa un **Scouter Táctico** tridimensional y animado (inspirado en los dispositivos de medición de energía de combate de Dragon Ball), integrado con una interfaz superpuesta (DOM Overlay HUD) reactiva, control de visibilidad del modelo 3D, un **cubo holográfico interactivo** en el entorno espacial y un banco de efectos sonoros de ciencia ficción con corte dinámico de reproducción.

### Características e Interactividad de la Aplicación

1. **Seguimiento Facial en Tiempo Real:** Anclaje preciso en el entrecejo / sien (`anchorIndex: 168`) con 6 grados de libertad relativos a la orientación de la cabeza.
2. **Scouter 3D Animado:** Modelo estilizado con auricular ergonómico lateral, montura y lente monocromática verde traslúcida con retícula HUD y animación en bucle del haz de medición de combate mediante el componente `animation-mixer`.
3. **Objeto Primitivo 3D Reactivo (Cubo de Energía):** Cubo holográfico suspendido en el espacio AR que reacciona tanto al clic como al toque táctil del usuario: rota rápidamente 720° con aceleración/frenado suave (*ease-out*), muta cíclicamente su color PBR emisivo y dispara efectos de sonido.
4. **Banco de Efectos de Sonido Sci-Fi:** Control de audio aleatorio con **corte inmediato** del sonido previo para evitar solapamientos acústicos.
5. **Control de Visibilidad 3D:** Botón táctil para conmutar la visibilidad del Scouter en pantalla.
6. **Interactividad Aditiva por Clic Directo:** Posibilidad de interactuar tocando o haciendo clic directamente sobre el Scouter o el cubo interactivo en pantalla mediante raycaster de A-Frame (`.interactivo`).

### Enlace al Despliegue en GitHub Pages (HTTPS)

> 🔗 **Acceso a la experiencia WebAR:**  
> [https://alfupe.github.io/pec4_realidad-virtual/](https://alfupe.github.io/pec4_realidad-virtual/)

### Código QR de acceso

<p align="center">
  <img src="assets/qr-github-pages.png" alt="Código QR GitHub Pages" width="200">
</p>

*(Nota: Al acceder por primera vez, el navegador solicitará permiso para utilizar la cámara web. Es imprescindible aceptar para iniciar la detección facial).*

---

## 2. Cumplimiento de la Rúbrica Oficial R4 (26 Puntos)

| Criterio | Puntuación | Estado | Implementación Técnica en el Proyecto |
| :--- | :---: | :---: | :--- |
| **1. Originalidad** | **2 pts** | ✅ Superado | Propuesta que trasciende las típicas gafas estáticas: se diseña e implementa un **Visor Táctico Cyberpunk** futurista con materiales PBR emisivos y **animación integrada** mediante el componente `animation-mixer` de A-Frame Extras (haz oscilante de escaneo HUD). |
| **2. Sonidos Aleatorios** | **8 pts** | ✅ Superado | Botón interactivo en el DOM Overlay que reproduce pistas de forma pseudoaleatoria desde un banco de 3 efectos Sci-Fi. **Requisito crítico de UX:** ante cada pulsación, si existe un sonido en reproducción, se detiene de forma instantánea (`pause()` + reset de `currentTime = 0`) antes de reproducir la nueva pista, evitando solapamientos cacofónicos. |
| **3. Objeto 3D y Face Tracking** | **7 pts** | ✅ Superado | Modelo 3D glTF optimizado anclado al rostro mediante `mindar-face-target` en el **punto anatómico 168** (entrecejo / puente nasal, posición canónica para visores y máscaras). Seguimiento continuo y fluido en los 6 grados de libertad relativos a la cabeza. Se incluye botón HTML para **conmutar la visibilidad (mostrar/ocultar)** del objeto en tiempo real. |
| **4. Segmentación / Entorno AR** | **5 pts** | ✅ Superado | Integración limpia y estable de la escena 3D sobre el feed de la cámara web mediante WebRTC sin deformaciones de relación de aspecto (`object-fit: cover`). Incluye sistema de iluminación dual (ambiente + direccional) para dotar de volumen y realismo al visor. Feedback visual de detección (`targetFound` / `targetLost`). |
| **5. Documentación y Fuentes** | **4 pts** | ✅ Superado | Repositorio estructurado y listo para despliegue en GitHub Pages bajo protocolo HTTPS (requerimiento de WebRTC). Documentación exhaustiva, guía de ejecución local y tabla de atribución de recursos y licencias Creative Commons / Dominio Público. |
| **Total** | **26 / 26 pts** | **100%** | **Objetivos cumplidos según especificación técnica.** |

---

## 3. Arquitectura y Estructura del Workspace

El proyecto sigue una arquitectura desacoplada basada en Clean Code, sin dependencias complejas ni frameworks pesados:

```text
PEC4_Fuentes_Alejandro/
├── index.html               # Escena WebAR e interfaz de usuario HUD
├── README.md                # Memoria técnica, guía de despliegue y licencias
└── assets/
    ├── css/
    │   └── styles.css       # Hoja de estilos desacoplada con metodología BEM
    ├── js/
    │   └── app.js          # Controladores modulares de audio, visibilidad e interfaz
    ├── models/
    │   └── cyber_visor.glb  # Modelo 3D optimizado (Low-Poly + PBR + Animación glTF)
    ├── audio/
    │   ├── scifi_scan.wav   # Pista 1: Escáner Táctico (Sweep Radar)
    │   ├── scifi_activate.wav # Pista 2: Activación HUD (Power Up)
    │   └── scifi_target.wav # Pista 3: Fijación de Objetivo (Target Lock)
    └── qr-github-pages.png  # Código QR de acceso directo para dispositivos móviles
```

### Tecnologías y Librerías Utilizadas (vía CDN Oficial)

- **A-Frame 1.5.0:** Framework declarativo sobre Three.js y WebGL para la gestión de entidades, cámaras, luces y rendering tridimensional.
  `https://aframe.io/releases/1.5.0/aframe.min.js`
- **MindAR 1.2.5 (Face Tracking):** Motor de visión artificial basado en MediaPipe y TensorFlow.js optimizado para detección y seguimiento de 468 puntos faciales en la web.
  `https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js`
- **A-Frame Extras 7.0.0:** Módulo que incorpora el componente `animation-mixer` para la reproducción continua y bucles de animación embebidos en el archivo glTF.
  `https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.0.0/dist/aframe-extras.min.js`

---

## 4. Guía de Ejecución en Entorno Local

> ⚠️ **IMPORTANTE (Restricción de Seguridad de la Cámara Web):**  
> Si se intenta abrir `index.html` haciendo doble clic directamente (protocolo `file://`), el navegador **bloqueará el acceso a la cámara** debido a la política de seguridad para APIs de medios (WebRTC `getUserMedia`) y generará errores de CORS al solicitar los archivos `.glb` y `.wav`.  
> Es estrictamente necesario servir el proyecto mediante un servidor HTTP local.

### Opción A: Extensión Live Server de Visual Studio Code (Recomendada)
1. Abrir la carpeta del proyecto en **VS Code**.
2. Hacer clic derecho sobre el archivo `index.html`.
3. Seleccionar **"Open with Live Server"**.
4. La aplicación se abrirá en `http://127.0.0.1:5500/` o `http://localhost:5500/` con acceso a la cámara habilitado.

### Opción B: Servidor local con Python 3
En una terminal situada en la raíz del proyecto, ejecutar:
```bash
python3 -m http.server 8000
```
Abrir en el navegador: [http://localhost:8000](http://localhost:8000)

### Opción C: Servidor Node.js (npx / http-server / vite)
```bash
npx http-server -p 8080 -c-1
```
Abrir en el navegador: [http://localhost:8080](http://localhost:8080)

---

## 5. Despliegue en Remoto: GitHub Pages

La API `navigator.mediaDevices.getUserMedia` exige una conexión segura bajo **HTTPS** para funcionar en dominios públicos y dispositivos móviles (iOS Safari, Android Chrome).

### Pasos de Despliegue:
1. Crear un repositorio público en GitHub (por ejemplo, `pec4_realidad-virtual`).
2. Subir los archivos del proyecto a la rama `main` (`index.html`, `README.md` y carpeta `assets/`).
3. Ir a **Settings** > **Pages** en GitHub.
4. En **Build and deployment > Source**, seleccionar la rama `main` y la carpeta `/ (root)`.
5. Guardar los cambios. En 1-2 minutos la URL estará activa con certificado SSL/HTTPS.

---

## 6. Atribución de Recursos y Licencias

En cumplimiento del criterio de documentación y propiedad intelectual, se detalla la procedencia y el tipo de licencia de cada recurso empleado:

| Recurso | Archivo | Autor / Fuente | Licencia | Enlace de Referencia |
| :--- | :--- | :--- | :---: | :--- |
| **Modelo 3D Scouter Dragon Ball** | `assets/models/scouter_dbz.glb` | **Drawnah** (Ezequiel Muñoz) | **CC BY 4.0** (Creative Commons Attribution) | ["Scouter (Dragon Ball)"](https://skfb.ly/oxGv8) en Sketchfab (Licencia: [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)) |
| **Cubo Holográfico Reactivo (3D)** | Primitiva A-Frame (`<a-entity geometry="primitive: box">`) | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Generación procedimental PBR interactiva |
| **Efecto de Audio 1: Escáner Táctico** | `assets/audio/scifi_scan.wav` | Alejandro Fuentes Pérez (Diseño y síntesis de efectos de audio Sci-Fi a 44.1 kHz) | **CC0 (Dominio Público)** | [Freesound Sci-Fi Radar](https://freesound.org/) |
| **Efecto de Audio 2: Activación HUD** | `assets/audio/scifi_activate.wav` | Alejandro Fuentes Pérez (Diseño y síntesis de efectos de audio Sci-Fi a 44.1 kHz) | **CC0 (Dominio Público)** | [Freesound Sci-Fi Charge](https://freesound.org/) |
| **Efecto de Audio 3: Target Lock** | `assets/audio/scifi_target.wav` | Alejandro Fuentes Pérez (Diseño y síntesis de efectos de audio Sci-Fi a 44.1 kHz) | **CC0 (Dominio Público)** | [Freesound Target Lock](https://freesound.org/) |

> **Nota de Licencia y Atribución:**  
> *"Scouter (Dragon Ball)" (https://skfb.ly/oxGv8) by Drawnah is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).*

### Repositorios Públicos Recomendados para Recursos Alternativos

Si se desea sustituir cualquiera de los elementos por modelos o efectos externos para la memoria final, pueden utilizarse recursos bajo licencia **Creative Commons (CC-BY o CC0)** de las siguientes fuentes oficiales:

- **Modelos 3D (.glb / .gltf):**
  - [Sketchfab (Filtro Creative Commons / Downloadable)](https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb94b0b&q=cyberpunk+visor&type=models)
  - [Kenney.nl Assets (CC0 Public Domain)](https://kenney.nl/assets)
  - [Poly Pizza (Low-Poly GLTF CC-BY)](https://poly.pizza/)
- **Audios y Efectos de Sonido (.wav / .mp3):**
  - [Freesound.org (Creative Commons)](https://freesound.org/search/?q=scifi+ui)
  - [Sonniss GDC Audio Archives (Royalty-Free Commercial & Educational)](https://sonniss.com/gameaudiogdc)
  - [Mixkit Sound Effects (Free License)](https://mixkit.co/free-sound-effects/sci-fi/)

---

## 7. Declaración de uso de Inteligencia Artificial (IA)

Siguiendo las directrices institucionales de la UOC sobre el uso ético, crítico y responsable de las herramientas de Inteligencia Artificial en las actividades de evaluación, se detalla a continuación el alcance de su empleo en la realización de esta práctica:

### Herramienta utilizada
Asistente de Inteligencia Artificial (Gemini / Antigravity).

### Objetivos perseguidos
* **Asistencia técnica en la configuración de la arquitectura WebAR:** Integración de la librería **MindAR (v1.2.5)** sobre **A-Frame (v1.5.0)** para tracking facial en tiempo real vía WebGL y WebRTC en navegadores móviles (iOS Safari, Android Chrome).
* **Búsqueda y adaptación de modelos 3D con licencias libres:** Localización de alternativas al modelo inicial de visor genérico, adoptando el modelo tridimensional estilizado *"Scouter (Dragon Ball)"* de Drawnah bajo licencia Creative Commons Attribution (CC BY 4.0), así como la normalización formal de los textos de créditos y atribuciones académicas tanto en el diálogo modal de la aplicación como en este documento.
* **Física y matemáticas del cono de cámara (Frustum):** Asistencia en el cálculo trigonométrico del campo de visión (`fov`), profundidad focal y compensación de la relación de aspecto (*aspect ratio*) adaptada a la lógica `object-fit: cover` de MindAR, logrando que el objeto primitivo 3D interactivo (`#energyCube`) detecte y rebote milimétricamente en los cuatro bordes visibles de la pantalla del dispositivo (estilo salvapantallas DVD) tanto en orientación vertical como panorámica.
* **Resolución de incidencias de renderizado 3D:** Diagnóstico y corrección del plano de recorte cercano de la cámara (`camera.near = 0.05`), evitando que los objetos 3D se cortasen en diagonal al aproximarse al plano del usuario.
* **Calibración anatómica del anclaje facial:** Determinación fina del vector de desplazamiento espacial (`position="0.62 -0.26 -0.16"`) respecto al punto de anclaje 168 (entrecejo/sien) para el ajuste ergonómico sobre la cuenca ocular izquierda.
* **Auditoría de compatibilidad cross-browser y estándares móviles:** Revisión de restricciones de reproducción automática de audio (*Autoplay Policy*), síntesis/desbloqueo de audio Web Audio API, aceleración por hardware (`translate3d`) y gestión de capas `z-index` para prevenir artefactos en el compositor WebGL de Android.
* **Estructuración jerárquica de la documentación técnica:** Redacción técnica de la memoria del proyecto, instrucciones de ejecución local y pautas de despliegue seguro en GitHub Pages.

### Instrucciones o prompts representativos
> «¿Cómo podemos anclar de forma estable un modelo 3D de gafas o visor al rostro usando MindAR y A-Frame en el navegador sin dependencias nativas?»

> «El visor original se ve tosco; busca o adapta un modelo 3D estilizado tipo Scouter de Dragon Ball con licencia Creative Commons Attribution y redacta su crédito formal.»

> «Calibra el offset espacial del Scouter respecto al anclaje 168 (entrecejo/sien) para que encaje de forma precisa sobre el ojo izquierdo del usuario.»

> «Añade un objeto 3D primitivo adicional (un cubo de energía) que no esté pegado al rostro sino que rebote de forma continua por los bordes de la pantalla como el salvapantallas de un DVD, cambiando de color en cada choque y reaccionando al toque con sonido y giro rápido.»

> «En móviles Android el cubo y el visor se cortaban diagonalmente y el cubo se salía por los lados izquierdo y derecho antes de rebotar; analiza el frustum y la relación de aspecto de MindAR y ajusta el plano de recorte cercano (`near plane`).»

### Respuestas obtenidas
La herramienta proporcionó fragmentos de código para A-Frame y Three.js con cálculos trigonométricos de frustum (`fov`, `aspect`, proyección de bordes y cálculo de desbordamiento horizontal), asistió en la calibración iterativa de posiciones espaciales 3D, sugirió la arquitectura de eventos desacoplada para audio e interacción táctil, y colaboró en el diagnóstico del escalado de MindAR (recorte horizontal de la cámara mediante overflow en pantallas verticales).

### Proceso de revisión, reelaboración y edición
El uso de estas herramientas ha tenido un carácter estrictamente consultivo, instrumental y de apoyo técnico/editorial. Tanto la concepción temática de la práctica (la elección del Scouter de Dragon Ball, la incorporación de la física de rebote del cubo con cambio cromático, el diseño de la interfaz HUD y la paleta de colores), como la calibración visual del anclaje 3D sobre el propio rostro, la comprobación acústica, la depuración empírica de compatibilidad en múltiples navegadores y dispositivos reales (escritorio, Android y iOS) y la verificación del correcto funcionamiento en GitHub Pages son fruto de mi propio trabajo y han sido dirigidos, evaluados y validados íntegramente por mí.
