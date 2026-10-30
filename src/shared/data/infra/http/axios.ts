/**
 * IMPORTS
 */
import axios, { type AxiosInstance } from "axios";

class ApiHttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;

  constructor() {
    this.instance = axios.create({
      baseURL: "",
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
