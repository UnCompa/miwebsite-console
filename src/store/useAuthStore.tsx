import axios from "axios";
import CryptoJS from "crypto-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import apiBase from "../config/api,config";
import { SECRET_CONSTANTS } from "../constants/secret.constants";
import { GetProfile } from "../interfaces/apis/getProfile.interface";

const SECRET_KEY = SECRET_CONSTANTS

interface AuthInterface {
  token: string;
  refreshToken: string;
  errors: string | null;
  signIn: (data: CredentialsSignIn) => Promise<boolean>;
  getProfile: () => Promise<GetProfile>;
  setCredentials: (data: SetCredentials) => void;
  logout: () => void;
  data: null | { roles: string[]; username: string; email: string; id: string };
  decryptedAuth: () => Omit<SetCredentials, 'errors'>;
}

interface CredentialsSignIn {
  username: string;
  password: string;
}

interface SetCredentials {
  token: string;
  refreshToken: string;
  errors?: string;
}

// 🔹 Función para encriptar datos
const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

// 🔹 Función para desencriptar datos
const decryptData = (data: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};

const useAuthStore = create<AuthInterface>()(
  persist(
    (set, get) => ({
      token: "",
      refreshToken: "",
      errors: null,
      data: null,

      setCredentials: (data: SetCredentials) => {
        set({
          token: encryptData(data.token),
          refreshToken: encryptData(data.refreshToken),
          errors: data?.errors || "",
        });
      },

      signIn: async (credentials: CredentialsSignIn): Promise<boolean> => {
        try {
          const { data } = await apiBase.post("/auth/login?lang=es", credentials);

          set({
            token: encryptData(data.token),
            refreshToken: encryptData(data.refreshToken),
            errors: null,
          });

          return true;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("Error en login:", error);
            set({ errors: error.response?.data?.message || "Error desconocido" });
          } else {
            console.error("Error inesperado:", error);
            set({ errors: "Error desconocido" });
          }
          return false;
        }
      },

      getProfile: async () => {
        try {
          const { data } = await apiBase.get("/auth/profile?lang=es");
          set({ data });
          return data;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("Error al obtener el perfil:", error);
            set({ errors: error.response?.data?.message || "Error desconocido" });
          } else {
            console.error("Error inesperado:", error);
            set({ errors: "Error desconocido" });
          }
          return false;
        }
      },

      logout: () => {
        console.log('BORRANDO DATOS')
        set({ token: "", refreshToken: "", data: null, errors: null });
      },
      decryptedAuth: () => {
        const { token, refreshToken } = get()
        return {
          token: decryptData(token),
          refreshToken: decryptData(refreshToken),
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // Usamos localStorage como almacenamiento
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        data: state.data,
      }),
    }
  )
);

export default useAuthStore;
