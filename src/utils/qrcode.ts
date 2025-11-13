import {
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import type { QRCodeSegment } from "qrcode";
import QRCode from "qrcode";
import { invertBlob, isBlackBgBlob } from "./helper";

class CodeReader {
  private static instance: BrowserMultiFormatReader | null = null;

  private constructor() {}

  public static getInstance(): BrowserMultiFormatReader {
    if (CodeReader.instance === null) {
      const hints = new Map();
      hints.set(DecodeHintType.CHARACTER_SET, "UTF-8");
      CodeReader.instance = new BrowserMultiFormatReader(hints, 500);
    }

    return CodeReader.instance;
  }
}

const lightModeColor = {
  dark: "#000000",
  light: "#ffffff",
};

const darkModeColor = {
  dark: "#ffffff",
  light: "#000000",
};

export async function qrcodeToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  isDark: boolean,
): Promise<void> {
  const data = new TextEncoder().encode(text);
  const segments: QRCodeSegment[] = [{ data: data, mode: "byte" }];
  await QRCode.toCanvas(canvas, segments, {
    width: 256,
    color: isDark ? darkModeColor : lightModeColor,
  });
}

export async function qrcodeToBlob(
  text: string,
  isDark: boolean,
): Promise<Blob> {
  const data = new TextEncoder().encode(text);
  const segments: QRCodeSegment[] = [{ data: data, mode: "byte" }];
  const dataUrl = await QRCode.toDataURL(segments, {
    width: 256,
    color: isDark ? darkModeColor : lightModeColor,
  });

  const blob = await fetch(dataUrl).then(
    (res: Response): Promise<Blob> => res.blob(),
  );

  return blob;
}

export async function decodeFromSource(source: Blob): Promise<string> {
  const isBlackBg = await isBlackBgBlob(source);
  const blob = isBlackBg ? await invertBlob(source) : source;
  const url = URL.createObjectURL(blob);
  const codeReader = CodeReader.getInstance();
  const res = await codeReader
    .decodeFromImageUrl(url)
    .finally(() => URL.revokeObjectURL(url));
  return res.getText();
}

export async function listVideoInputDevices(): Promise<MediaDeviceInfo[]> {
  const codeReader = CodeReader.getInstance();
  const videoInputDevices = await codeReader.listVideoInputDevices();
  return videoInputDevices;
}

export async function decodeFromVideoDevice(
  deviceId: string | null,
  el: HTMLVideoElement,
): Promise<string> {
  const codeReader = CodeReader.getInstance();
  return new Promise((resolve, reject) => {
    codeReader.decodeFromVideoDevice(deviceId, el, (result, err) => {
      if (result) resolve(result.getText());
      if (err && !(err instanceof NotFoundException)) reject(err);
    });
  });
}

export function decodeReset(): void {
  const codeReader = CodeReader.getInstance();
  codeReader.reset();
}
