import { PaginationRequest } from '../common/interfaces/pagination.interface';
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

export interface ListUserWithFilterRequest extends PaginationRequest {
  username: string;
  email: string;
}

export interface UpdateUserRequest {
  id: number;
  username: string;
}
