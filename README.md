# PEC 4: WebAR Face Tracking con MindAR y A-Frame

**Asignatura:** Realidad Virtual (Semestre 2627/1)  
**Estudiante:** Alejandro Fuentes Pérez (`alfupe@uoc.edu`)  
**Grado:** Grado de Multimedia - Universitat Oberta de Catalunya (UOC)  

---

## Acceso al proyecto

El proyecto está publicado y operativo en GitHub Pages bajo protocolo HTTPS (necesario para el acceso a la cámara mediante WebRTC):

🔗 **[https://alfupe.github.io/pec4_realidad-virtual/](https://alfupe.github.io/pec4_realidad-virtual/)**

<p align="center">
  <img src="assets/qr-github-pages.png" alt="Código QR GitHub Pages" width="180">
</p>

---

## Descripción y funcionalidades

Esta práctica implementa una experiencia de Realidad Aumentada web (WebAR) de seguimiento facial (*Face Tracking*) en tiempo real a través del navegador. En lugar de utilizar software propietario como Lens Studio, se ha desarrollado con estándares web abiertos mediante **MindAR 1.2.5** y **A-Frame 1.5.0** (Three.js).

### Requisitos del enunciado implementados

1. **Objeto 3D anclado al rostro (Scouter Saiyan):**
   - Se utiliza un modelo 3D de un *Scouter* (visor de Dragon Ball) anclado al entrecejo mediante el punto de referencia anatómico 168 de la malla facial, calibrado con precisión sobre el ojo izquierdo.
   - Dispone de un botón en la interfaz para **mostrar u ocultar** el visor en cualquier momento.

2. **Reproducción de sonidos aleatorios (Dragon Ball):**
   - Botón interactivo que reproduce pistas de forma aleatoria desde un banco de 3 efectos sonoros icónicos de Dragon Ball:
     * *Escáner Scouter (Medición de Ki)*
     * *Teletransporte (Shunkan Ido / Carga de Ki)*
     * *Radar Dragón (Detección de Esfera)*
   - Si se pulsa mientras suena una pista, se detiene inmediatamente antes de iniciar la siguiente, evitando solapamientos acústicos.

3. **Objeto 3D adicional reactivo (Bola de Dragón de 4 estrellas):**
   - Se incorpora un elemento 3D adicional que se desplaza y **rebota por los bordes de la pantalla** calculando dinámicamente los límites del frustum de la cámara.
   - Diseñado como la mítica esfera de cuatro estrellas de Goku, emite un destello de energía Ki dorado al rebotar contra los bordes.
   - Al tocarlo o hacer clic sobre él, emite sonido temático, un pulso de luz Ki y rota sobre sí mismo 720° con aceleración.

4. **Interfaz temática Dragon Ball y compatibilidad móvil:**
   - Interfaz HUD superior e inferior con estética Dragon Ball / Capsule Corp (tonos ámbar, naranja y azul Saiyan) adaptada a pantallas táctiles y móviles (Android / iOS) con manejo de márgenes seguros (*safe-area-inset*).

---

## Estructura de archivos

```text
PEC4_Fuentes_Alejandro/
├── index.html               # Escena WebAR e interfaz de usuario
├── README.md                # Memoria del proyecto, créditos y licencias
├── PEC4_Fuentes_Alejandro.txt # Enlaces de entrega
└── assets/
    ├── css/
    │   └── styles.css       # Estilos de la interfaz temática DBZ
    ├── js/
    │   └── app.js          # Lógica de tracking, audio y física de la esfera
    ├── models/
    │   └── scouter_dbz.glb  # Modelo 3D del Scouter (Drawnah, CC BY 4.0)
    ├── textures/
    │   └── dragon_ball_4star.png # Textura procedural de la esfera de 4 estrellas
    ├── audio/
    │   ├── scifi_scan.wav   # Efecto 1: Escáner Scouter (Ki)
    │   ├── scifi_activate.wav # Efecto 2: Teletransporte (Shunkan Ido)
    │   └── scifi_target.wav # Efecto 3: Radar Dragón
    └── qr-github-pages.png  # Código QR de acceso
```

---

## Ejecución en entorno local

Las APIs de cámara web (`navigator.mediaDevices.getUserMedia`) y la carga de modelos `.glb` requieren un entorno seguro (`localhost` o `https://`). No pueden ejecutarse abriendo el archivo HTML directamente por protocolo `file://`.

### Opción 1: Live Server (VS Code)
Hacer clic derecho sobre `index.html` y seleccionar **Open with Live Server**.

### Opción 2: Servidor Python
```bash
python3 -m http.server 8080
```
Abrir en el navegador: `http://localhost:8080`

---

## Recursos y licencias

| Recurso | Archivo | Autor / Fuente | Licencia | Enlace |
| :--- | :--- | :--- | :---: | :--- |
| **Modelo 3D Scouter** | `assets/models/scouter_dbz.glb` | Drawnah | **CC BY 4.0** | ["Scouter (Dragon Ball)"](https://skfb.ly/oxGv8) en Sketchfab |
| **Textura Bola de Dragón (4★)** | `assets/textures/dragon_ball_4star.png` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Generación procedural equirrectangular |
| **Audio 1: Escáner Scouter** | `assets/audio/scifi_scan.wav` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Diseño sonoro sintético 44.1 kHz |
| **Audio 2: Teletransporte** | `assets/audio/scifi_activate.wav` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Diseño sonoro sintético 44.1 kHz |
| **Audio 3: Radar Dragón** | `assets/audio/scifi_target.wav` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Diseño sonoro sintético 44.1 kHz |

> **Atribución CC BY 4.0:**  
> *"Scouter (Dragon Ball)" (https://skfb.ly/oxGv8) by Drawnah is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).*

---

## Declaración de uso de Inteligencia Artificial (IA)

Siguiendo las directrices de la UOC sobre el uso de herramientas de Inteligencia Artificial en las actividades de evaluación:

### Herramienta utilizada
Asistente de IA (Gemini / Antigravity).

### Objetivos perseguidos
* **Búsqueda y generación de recursos multimedia:** Localización en Sketchfab del modelo 3D del Scouter de Drawnah (CC BY 4.0), generación procedural de la textura de 4 estrellas de la Bola de Dragón y síntesis de efectos de sonido retro-anime en formato WAV a 44.1 kHz.
* **Generación de recursos gráficos:** Creación del código QR en formato PNG optimizado para el acceso directo a la versión desplegada en GitHub Pages desde el móvil.
* **Configuración del entorno de desarrollo local:** Puesta en marcha de un servidor HTTPS local con certificados SSL autofirmados para permitir el acceso a la cámara mediante WebRTC en dispositivos móviles conectados a la red local y calibrar el visor en tiempo real.
* **Cálculo matemático 3D y compatibilidad móvil:** Asistencia en la trigonometría del frustum de cámara en Three.js y compensación de aspect ratio (`object-fit: cover` de MindAR) para el rebote continuo de la Bola de Dragón en los límites de pantalla, diagnóstico de políticas de autoplay en Safari iOS (`playsinline` con `MutationObserver`) y ajuste del plano de corte cercano (`camera.near = 0.05`).
* **Documentación técnica:** Apoyo en la estructuración, normalización de créditos de autoría y redacción de este documento (`README.md`).

### Prompts representativos
> «Ayúdame a buscar en Sketchfab un modelo 3D optimizado de un Scouter de Dragon Ball con licencia Creative Commons para sustituir las gafas actuales.»

> «En Safari iOS el elemento video de la cámara de MindAR a veces no arranca por políticas de autoplay. ¿Cómo aseguramos playsinline y muted mediante un MutationObserver en cuanto se inyecte el nodo?»

> «Genera un código QR que enlace a https://alfupe.github.io/pec4_realidad-virtual/ para integrarlo en la interfaz y en el README.»

> «Monta un servidor local HTTPS rápido con Python y certificados SSL para probar la cámara y calibrar el visor directamente en mi móvil en red local.»

> «¿Cómo calculamos los límites visibles del frustum en Three.js teniendo en cuenta que MindAR recorta horizontalmente el canvas en móviles para que la Bola de Dragón rebote exactamente en los cuatro bordes de la pantalla?»

> «Estructura y redacta el README.md de la práctica de forma concisa y sin verborrea.»

### Respuestas obtenidas y proceso de revisión
La herramienta ofreció enlaces y sugerencias de búsqueda, generó el código QR y el script de servidor local HTTPS, facilitó cálculos trigonométricos para A-Frame y Three.js, y ayudó en la redacción técnica. La selección final del modelo, su calibración anatómica sobre el rostro, la validación acústica, la comprobación en navegadores y dispositivos reales (escritorio, iOS y Android) y el resultado definitivo han sido revisados, evaluados y asumidos íntegramente por el estudiante.
