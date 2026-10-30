/**
 * IMPORTS
 */
import axios, { type AxiosInstance } from "axios";
import { brand } from "@/brand/brand";

class ApiHttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;

  constructor() {
    this.instance = axios.create({
      // Cada cliente tem a sua API (apiUrl no clients/<cliente>/config.json).
      baseURL: brand.apiUrl,
      timeout: 15000,
    });
  }

  getInstance() {
    return this.instance;
  }
}

const apiClient = new ApiHttpClient().getInstance();

/**
 * EXPORTS
 */
export { ApiHttpClient, apiClient };
