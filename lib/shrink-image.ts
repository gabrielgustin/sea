// Achica una foto en el navegador antes de subirla: lado mayor de 1920 px, en WebP.
// Una foto de celular (3-8 MB) queda en unos cientos de KB: sube en un segundo y entra en el límite de Vercel (4,5 MB).
// Si algo falla, o el resultado no es más liviano, devuelve el archivo original.
export async function shrinkImage(file: File, max = 1920, quality = 0.85): Promise<File> {
  if (file.type === 'image/gif' || typeof createImageBitmap !== 'function') return file; // los GIF pueden ser animados
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 500 * 1024) return file; // ya es chica
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', quality));
    // Sin WebP (Safari viejo devuelve PNG): JPEG, salvo PNG que pueden tener transparencia.
    const out = blob?.type === 'image/webp' ? blob
      : file.type === 'image/png' ? null
      : await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality));
    if (!out || out.size >= file.size) return file;
    const ext = out.type === 'image/webp' ? 'webp' : 'jpg';
    return new File([out], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type: out.type });
  } catch {
    return file;
  }
}
