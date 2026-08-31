declare global {
  namespace Express {
    interface User {
      id: number;
      login: string;
      refresh_token?: string;
    }
  }
}

export {};
