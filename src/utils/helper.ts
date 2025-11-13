export function disableContextMenu(): void {
  if (import.meta.env.PROD && import.meta.env.MODE === "production")
    document.documentElement.oncontextmenu = (): boolean => false;
}

export function setDocumentTitle(title: string): void {
  document.title = title;
}

export function getByteLength(str: string): number {
  return new TextEncoder().encode(str).length;
}

export async function invertBlob(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  ctx.putImageData(imageData, 0, 0);

  return await canvas.convertToBlob({ type: "image/png" });
}

export async function isBlackBgBlob(blob: Blob): Promise<boolean> {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let darkPixels = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    if (brightness < 128) darkPixels++;
  }

  return darkPixels / totalPixels > 0.5;
}
