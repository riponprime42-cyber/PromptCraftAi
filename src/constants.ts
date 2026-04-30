import { AspectRatio, StyleOption } from "./types";

export const STYLES: StyleOption[] = [
  { id: 'realistic', name: 'Realistic', description: 'Photorealistic, high detail, lifelike textures' },
  { id: 'cinematic', name: 'Cinematic', description: 'Dramatic lighting, anamorphic lenses, film look' },
  { id: 'anime', name: 'Anime', description: 'Studio Ghibli or Makoto Shinkai style, vibrant colors' },
  { id: '3d-render', name: '3D Render', description: 'Octane render, Unreal Engine 5, high polish' },
  { id: 'cartoon', name: 'Cartoon', description: 'Playful, stylized, bold lines and simple shapes' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon lights, futuristic cityscapes, high tech' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple, geometric, focused' },
  { id: 'fantasy', name: 'Fantasy', description: 'Ethereal, magical, intricate details, epic scale' },
];

export const ASPECT_RATIOS: { label: AspectRatio; width: number; height: number }[] = [
  { label: '1:1', width: 40, height: 40 },
  { label: '16:9', width: 48, height: 27 },
  { label: '9:16', width: 27, height: 48 },
  { label: '4:3', width: 48, height: 36 },
  { label: '3:4', width: 36, height: 48 },
];
