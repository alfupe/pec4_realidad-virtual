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

1. **Objeto 3D anclado al rostro (Scouter):**
   - Se utiliza un modelo 3D de un *Scouter* (visor de Dragon Ball) anclado al entrecejo mediante el punto de referencia anatómico 168 de la malla facial, calibrado con precisión sobre el ojo izquierdo.
   - Dispone de un botón en la interfaz para **mostrar u ocultar** el visor en cualquier momento.

2. **Reproducción de sonidos aleatorios:**
   - Botón interactivo que reproduce pistas de forma aleatoria desde un banco de 3 efectos sonoros Sci-Fi.
   - Si se pulsa mientras suena una pista, se detiene inmediatamente antes de iniciar la siguiente, evitando solapamientos acústicos.

3. **Objeto 3D adicional reactivo (Cubo de energía):**
   - Se incorpora un elemento 3D adicional que se desplaza y **rebota por los bordes de la pantalla** calculando dinámicamente los límites del frustum de la cámara.
   - Cambia de color automáticamente con cada rebote.
   - Al tocarlo o hacer clic sobre él, emite sonido, cambia de color y rota sobre sí mismo 720° con aceleración.

4. **Interfaz y compatibilidad móvil:**
   - Interfaz HUD superior e inferior adaptada a pantallas táctiles y móviles (Android / iOS) con manejo de márgenes seguros (*safe-area-inset*).

---

## Estructura de archivos

```text
PEC4_Fuentes_Alejandro/
├── index.html               # Escena WebAR e interfaz de usuario
├── README.md                # Memoria del proyecto, créditos y licencias
├── PEC4_Fuentes_Alejandro.txt # Enlaces de entrega
└── assets/
    ├── css/
    │   └── styles.css       # Estilos de la interfaz
    ├── js/
    │   └── app.js          # Lógica de tracking, audio y física del cubo
    ├── models/
    │   └── scouter_dbz.glb  # Modelo 3D del Scouter (Drawnah, CC BY 4.0)
    ├── audio/
    │   ├── scifi_scan.wav   # Efecto 1: Escaneo
    │   ├── scifi_activate.wav # Efecto 2: Activación
    │   └── scifi_target.wav # Efecto 3: Fijación
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
| **Cubo 3D reactivo** | Primitiva A-Frame (`<a-entity>`) | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Generación procedural en Three.js |
| **Audio 1: Escáner** | `assets/audio/scifi_scan.wav` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Diseño sonoro sintético 44.1 kHz |
| **Audio 2: Activación** | `assets/audio/scifi_activate.wav` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Diseño sonoro sintético 44.1 kHz |
| **Audio 3: Fijación** | `assets/audio/scifi_target.wav` | Alejandro Fuentes Pérez | **CC0 (Dominio Público)** | Diseño sonoro sintético 44.1 kHz |

> **Atribución CC BY 4.0:**  
> *"Scouter (Dragon Ball)" (https://skfb.ly/oxGv8) by Drawnah is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).*

---

## Declaración de uso de Inteligencia Artificial (IA)

Siguiendo las directrices de la UOC sobre el uso de herramientas de Inteligencia Artificial en las actividades de evaluación:

### Herramienta utilizada
Asistente de IA (Gemini / Antigravity).

### Objetivos perseguidos
* Asistencia en el cálculo trigonométrico para determinar el volumen visible de la cámara (*frustum*) y la compensación de aspect ratio (`object-fit: cover` de MindAR) para que el cubo 3D detecte los límites de la pantalla y rebote limpiamente en los bordes.
* Apoyo en la resolución de problemas de renderizado: corrección del plano de recorte cercano (`camera.near = 0.05`) para evitar cortes visuales en los modelos 3D cerca de la cámara.
* Búsqueda de alternativas libres al visor inicial y redacción normalizada de los créditos y licencias Creative Commons.
* Asistencia en la compatibilidad cross-browser para dispositivos móviles (desbloqueo de audio y reproducción de vídeo en Android/iOS).

### Prompts representativos
> «¿Cómo calculamos los límites visibles del frustum en Three.js teniendo en cuenta que MindAR recorta horizontalmente el canvas en móviles verticales para que un objeto rebote en los cuatro bordes de la pantalla?»

> «En móviles el modelo y el cubo se cortan diagonalmente al acercarse; revisa la configuración del plano de recorte cercano (`near plane`) de la cámara en A-Frame.»

> «Redacta el bloque de atribución de licencia CC BY 4.0 para el modelo Scouter de Drawnah de Sketchfab de acuerdo con las pautas académicas.»

### Respuestas obtenidas y proceso de revisión
La herramienta ofreció fórmulas de proyección de cámara y sugerencias de implementación en JavaScript. Todos los cálculos, la calibración espacial del visor sobre el ojo izquierdo, la integración en la interfaz y las pruebas empíricas en múltiples dispositivos reales han sido revisados, modificados, evaluados y validados por el estudiante.
