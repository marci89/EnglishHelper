//Auth user
export interface LoginUser {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}

//Change email
export interface ChangeEmailRequest {
  email: string;
  password: string;
}

//Change password
export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}

//forgot password
export interface ForgotPasswordRequest {
  identifier: string;
}

//reset password
export interface ResetPasswordRequest {
  password: string;
  token?: string;
}

//delete account request
export interface DeleteAccountRequest {
  identifier: string;
  password: string;
}


