export interface User {
  username: string;
  token: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegistrationRequest {
  username: string;
  password: string;
  email: string;
}
