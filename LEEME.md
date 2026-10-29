# IA Holográfica · Control por Gestos

## Archivos
| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura (reemplaza a `index9.html`) |
| `style.css` | Estilos |
| `app.js` | Toda la lógica |
| `sw.js` | Service worker: guarda la app y los videos para usar sin internet |
| `manifest.webmanifest` + `icon-*.png` | Permite instalarla como app (pantalla completa) |
| `vid1.mp4 … vid5.mp4` | Tus videos, en la misma carpeta que `index.html` |
| `mediapipe/` | Detector de manos local (lo crea el workflow, ver abajo) |
| `.github/workflows/descargar-mediapipe.yml` | Baja `mediapipe/` solo, sin usar la PC |

## Pasos
1. Subí todos los archivos de arriba al repositorio (junto a los videos). Podés borrar `index9.html`.
2. En GitHub: **Add file → Create new file**, escribí el nombre `.github/workflows/descargar-mediapipe.yml` (con las barras) y pegá el contenido del archivo.
3. **Settings → Actions → General → Workflow permissions → Read and write permissions → Save**.
4. Pestaña **Actions → Descargar MediaPipe → Run workflow**. En ~1 minuto aparece la carpeta `mediapipe/` (unos 25 MB).
5. Abrí la página **con WiFi** → ⚙️ Configurar → **Guardar videos y detector para offline**.
6. En Chrome: menú ⋮ → **Instalar app** / **Agregar a pantalla de inicio**. Se abre en pantalla completa y funciona sin internet.

## Cuando cambies algo
Si modificás `index.html`, `style.css` o `app.js`, subí el número `VERSION` en `sw.js` (`'v1'` → `'v2'`). Si cambiás un video, volvé a tocar "Guardar videos…" en ⚙️.

## Si todavía va pesado en el celular
- ⚡ Rendimiento → preset **Mínimo** o **Bajo**; probá también *Procesador del detector = CPU*.
- Reducí los videos a 720p (se ven igual en el celular y pesan mucho menos):
  `ffmpeg -i vid1.mp4 -vf "scale=-2:720" -c:v libx264 -profile:v main -crf 26 -preset slow -r 30 -c:a aac -b:a 96k -movflags +faststart vid1_720.mp4`
