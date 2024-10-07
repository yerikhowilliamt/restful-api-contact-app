/* eslint-disable prettier/prettier */
export class UserResponse {
  username: string;
  email: string;
  token?: string;
}

export class RegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class UpdateUserRequest {
  username?: string;
  password?: string;
}
