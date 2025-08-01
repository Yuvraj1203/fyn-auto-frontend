export type UserType = {
  id?: string;
  username?: string;
  password?: string;
  role?: string;
};

export type LoginModel = {
  accessToken?: string;
  tokenType?: string;
  user?: UserType;
  message: string;
};
