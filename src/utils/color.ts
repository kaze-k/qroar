import { average } from "color.js";

export async function getAverageColor(url: string): Promise<string> {
  const color = await average(url, { format: "hex" });
  return color as string;
}
