import { AuthResponse, User } from "../types/api";
import { getApiBaseUrl } from "../config/apiConfig";

const TOKEN_KEY = "policyguard_token";
const USER_KEY = "policyguard_user";

export const AuthService = {
  async login(email: string, role: string): Promise<AuthResponse> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/auth/login`;

    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
    } catch (networkErr: any) {
      throw new Error(`Network error connecting to backend API (${baseUrl}): ${networkErr.message || 'Server unreachable'}`);
    }

    if (!res.ok) {
      let errorMsg = `Server error (HTTP ${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.detail) errorMsg = errJson.detail;
        else if (errJson.message) errorMsg = errJson.message;
      } catch {
        const text = await res.text().catch(() => "");
        if (text && text.length < 100) errorMsg = text;
      }
      throw new Error(errorMsg);
    }


    const data: AuthResponse = await res.json();
    
    // Persist session
    localStorage.setItem(TOKEN_KEY, data.access_token);
    // Store minimal user info for persistence
    localStorage.setItem(USER_KEY, JSON.stringify({ 
      email: data.user.email, 
      role: data.user.role 
    }));

    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const u = localStorage.getItem(USER_KEY);
    if (!u) return null;
    try {
      const parsed = JSON.parse(u);
      return {
        id: "me",
        email: parsed.email,
        role: parsed.role,
        // Fix: Populate metadata so Dashboard doesn't crash
        user_metadata: { display_name: parsed.email.split('@')[0] } 
      };
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};