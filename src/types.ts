export type LetterCategory = 'Literature' | 'Politics' | 'Poetry' | 'Romance';

export type FontOption = 'script' | 'serif' | 'mono';

export type PaperTexture = 'lined' | 'vellum' | 'torn';

export interface Critique {
  id: string;
  author: string;
  role: string;
  avatarColor: string;
  content: string;
  likes: number;
  isLiked: boolean;
  timestamp: string;
}

export interface Letter {
  id: string;
  title: string;
  category: LetterCategory;
  recipient: string;
  dateLocation: string;
  body: string;
  sender: string;
  font: FontOption;
  texture: PaperTexture;
  isTypewriterMode: boolean;
  hasDropCap: boolean;
  isSealed: boolean;
  sealedDate?: string;
  marginalia: string;
  critiques: Critique[];
  createdAt: string;
  updatedAt: string;
}

export type AmbientSound = 'typewriter' | 'rain' | 'quill' | 'none';
