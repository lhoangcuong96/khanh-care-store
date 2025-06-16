"use client";
import { STORE_KEYS } from ".";

// Đảm bảo đây là một client component

class SessionStore {
  private static instance: SessionStore | null = null;

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private userId: string | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): SessionStore {
    if (this.instance === null) {
      this.instance = new SessionStore();
      if (typeof window !== "undefined") {
        // Chỉ gọi localStorage khi đang ở client
        this.instance.loadTokens();
      }
    }
    return this.instance;
  }

  private loadTokens(): void {
    this.accessToken = localStorage.getItem(STORE_KEYS.accessToken);
    this.refreshToken = localStorage.getItem(STORE_KEYS.refreshToken);
    this.userId = localStorage.getItem(STORE_KEYS.userId);
  }

  public setTokens(accessToken: string, refreshToken: string, userId: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
    localStorage.setItem(STORE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORE_KEYS.refreshToken, refreshToken);
    localStorage.setItem(STORE_KEYS.userId, userId || "");
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem(STORE_KEYS.accessToken);
    localStorage.removeItem(STORE_KEYS.refreshToken);
    localStorage.removeItem(STORE_KEYS.userId);
  }
}

export default SessionStore.getInstance();
