export interface InfoModel {
  id?: string;
  name: string;
  lastName: string;
  age: number;
  category: string;
  needsTransport: boolean;
  passengers?: number | null;
  attendsLunch: boolean;
  confirmed: boolean;
  winner?: boolean;
}

export interface AuthResponse {
  email: string;
  jwt: string;
  message: string;
  role: string;
}

export interface Draw {
  id?: number;
  createdAt?: Date;
  winners: string[];
}

export interface DrawInfo {
  id: number;
  createdAt: Date;
  infos: InfoModel[];
}

export interface PageResponse<T> {
  content: T[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
}