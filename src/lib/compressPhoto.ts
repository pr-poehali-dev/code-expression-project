// Прокси-сервер обрывает запрос с ошибкой 413, если тело больше ~3.5 МБ — а обычное фото с
// телефона после кодирования в base64 легко превышает лимит, даже уложившись в 8 МБ на выбор
// файла. Поэтому перед отправкой сжимаем фото через canvas: уменьшаем сторону и подбираем
// качество JPEG, пока base64-строка не станет безопасного размера.
export function compressPhoto(dataUrl: string, maxSide = 1280, maxBase64Bytes = 1_500_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSide || height > maxSide) {
        const scale = maxSide / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      let result = canvas.toDataURL("image/jpeg", quality);
      while (result.length > maxBase64Bytes && quality > 0.3) {
        quality -= 0.15;
        result = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(result);
    };
    img.onerror = () => reject(new Error("Не удалось прочитать изображение"));
    img.src = dataUrl;
  });
}
