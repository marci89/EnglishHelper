import { PaginationRequest } from '../common/interfaces/pagination.interface';

//User model
export interface User {
  id: number;
  role: string;
  username: string;
  email: string;
  created: Date;
  lastActive: Date;
}

//Request for login
export interface LoginRequest {
  identifier?: string;
  password?: string;
}

//Request for register
export interface RegistrationRequest {
  username: string;
  password: string;
  email: string;
}

//Request for paged list user
export interface ListUserWithFilterRequest extends PaginationRequest {
  username: string;
  email: string;
}

//Request for update user
export interface UpdateUserRequest {
  id: number;
  username: string;
}
