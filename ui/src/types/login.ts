export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

export interface Session {
  user: GoogleUser;
  expiresAt: number;
}
