export interface InfoModel {
  id?: string;
  name: string;
  lastName: string;
  activity: string;
  phone: string;
  reasons: string[];
  accept: boolean;
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