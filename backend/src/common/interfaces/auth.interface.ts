export interface JwtPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  tokens: TokenPair;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UserFromJwt {
  userId: string;
  email: string;
}