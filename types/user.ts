export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;

  avatarUrl: string | null;
  bio: string | null;
  displayUsername: string | null;
  image: string | null;
  phone: string | null;

  createdAt: string;
  updatedAt: string;
}
