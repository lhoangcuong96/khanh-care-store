"use client"; // Đảm bảo đây là một client component

export enum STORE_KEYS {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
  adminSidebarExpandList = "admin:sidebar-expand-list",
}

class LocalStore {
  private static instance: LocalStore | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): LocalStore | null {
    if (typeof window === "undefined") {
      return null;
    }
    if (this.instance === null) {
      this.instance = new LocalStore();
    }
    return this.instance;
  }
  getKey(key: STORE_KEYS) {
    return localStorage.getItem(key);
  }

  setKey(key: STORE_KEYS, value: string) {
    localStorage.setItem(key, value);
  }
}

export default LocalStore.getInstance();
