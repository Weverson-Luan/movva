/**
 * IMPORTS
 */
import axios, { type AxiosInstance } from "axios";
import Constants from "expo-constants";
import { brand } from "@/shared/brand/brand";
import { mapHttpError } from "./http-error-mapper";

// Produção: apiUrl do cliente. Desenvolvimento: apiUrlDev do cliente
// (clients/<cliente>/config.json). No emulador Android e no celular,
// "localhost" é o próprio aparelho, então trocamos pelo IP do computador
// que está rodando o Metro (o mesmo onde roda a API local).
const getBaseUrl = () => {
  if (!__DEV__ || !brand.apiUrlDev) return brand.apiUrl;

  const devHost = Constants.expoConfig?.hostUri?.split(":")[0];
  return devHost ? brand.apiUrlDev.replace("localhost", devHost) : brand.apiUrlDev;
};

class ApiHttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;

  constructor() {
    this.instance = axios.create({
      baseURL: getBaseUrl(),
      timeout: 15000,
    });

    // Todo erro HTTP sai daqui já convertido em erro do domínio (AppError).
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(mapHttpError(error)),
    );
  }

  getInstance() {
    return this.instance;
  }
}

const apiClient = new ApiHttpClient().getInstance();

/**
 * EXPORTS
 */
export { ApiHttpClient, apiClient, getBaseUrl };
