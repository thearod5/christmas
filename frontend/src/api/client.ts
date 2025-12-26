/**
 * API client with type-safe endpoints
 */
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { LetterPublic } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Public letter endpoint
  async getPublicLetter(slug: string): Promise<LetterPublic> {
    const response = await this.client.get<LetterPublic>(`/letters/${slug}/`);
    return response.data;
  }
}

export const apiClient = new APIClient();