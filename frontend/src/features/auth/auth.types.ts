
export type AppUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  modifiedAt: string;
  authorities: string[];
  enabled: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export type LoginRequest = {
  username: string;
  password: string;
}

export type RegisterRequest = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  verifyPassword: string;
}

export type ChangePasswordRequest = {
  code: string;
  username: string;
  newPassword: string;
  verifyNewPassword: string;
}