export interface InfoModel {
  id?: number;
  name: string;
  activity: string;
  phone: string;
  reasons: string[];
}

export interface AuthResponse {
  email: string;
  jwt: string;
  message: string;
  role: string;
}