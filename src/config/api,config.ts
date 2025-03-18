import axios from "axios";
import { API_BACKEND_URL } from "../constants/api.constants";
import useAuthStore from "../store/useAuthStore";

const apiBase = axios.create({
  baseURL: API_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para rastrear si ya estamos refrescando el token
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

apiBase.interceptors.request.use((config) => {
  const { decryptedAuth } = useAuthStore.getState();
  const { token } = decryptedAuth()
  console.log('REALIZANDO PETICION...', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiBase.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la devolvemos tal cual
  async (error) => {
    const originalRequest = error.config;
    const { decryptedAuth, setCredentials } = useAuthStore.getState();
    const dataToken = decryptedAuth();
    console.log('REFREZCANDO PETICION...', dataToken)

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!dataToken.refreshToken) {
        setCredentials({ token: "", refreshToken: "", errors: "Sesión expirada, inicia sesión nuevamente." });
        // Redirigir al login si hay un error
        window.location.href = '/login'; // O usar navigate si tienes acceso a useNavigate
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await axios.post(`${API_BACKEND_URL}/auth/refreshToken?lang=es`, {
            refreshToken: dataToken.refreshToken,
          });

          setCredentials({ token: data.token, refreshToken: data.refreshToken });
          isRefreshing = false;
          onRefreshed(data.token);
        } catch (refreshError) {
          setCredentials({ token: "", refreshToken: "", errors: "Sesión expirada, inicia sesión nuevamente." });
          isRefreshing = false;
          // Redirigir al login si hay un error
          window.location.href = '/login'; // O usar navigate si tienes acceso a useNavigate
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiBase(originalRequest));
        });
      });
    }

    // Redirigir al login si hay un error 401
    if (error.response?.status === 401) {
      window.location.href = '/login'; // O usar navigate si tienes acceso a useNavigate
    }

    return Promise.reject(error);
  }
);

export default apiBase;
