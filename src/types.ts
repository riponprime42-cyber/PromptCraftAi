export type PromptType = 'image' | 'video';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  previewUrl?: string; // Optional if we want to show a small icon/image
}

export interface GeneratedPrompt {
  id: string;
  type: PromptType;
  input: string;
  style: string;
  ratio: AspectRatio;
  output: string;
  createdAt: number;
  isFavorite?: boolean;
}
