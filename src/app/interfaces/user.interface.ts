export interface LoginUser {
  username: string;
  role: string;
  token: string;
}

export interface User {
  id: number;
  role: string;
  username: string;
  email: string;
  created: Date;
  lastActive: Date;
}

export interface LoginRequest {
  identifier?: string;
  password?: string;
}

export interface RegistrationRequest {
  username: string;
  password: string;
  email: string;
}
