export interface InfoModel {
  id?: number;
  name: string;
  lastName: string;
  activity: string;
  phone: string;
  reasons: string[];
  accept: boolean;
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
  winners: number[];
}

export interface DrawInfo {
  id: number;
  createdAt: Date;
  infos: InfoModel[];
}
