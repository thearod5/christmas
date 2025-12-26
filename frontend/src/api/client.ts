/**
 * API client with type-safe endpoints
 */
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  Letter,
  LetterPublic,
  LetterType,
  LoginRequest,
  LoginResponse,
  CreateLetterRequest,
  UpdateLetterRequest,
  CreateLetterTypeRequest,
  APIError,
} from '../types/index';

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

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIError>) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - could redirect to login
          console.error('Unauthorized request');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout/');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me/');
    return response.data;
  }

  // Public letter endpoint
  async getPublicLetter(slug: string): Promise<LetterPublic> {
    const response = await this.client.get<LetterPublic>(`/letters/${slug}/`);
    return response.data;
  }

  // Admin - Letters
  async getLetters(): Promise<Letter[]> {
    const response = await this.client.get<{ results: Letter[] }>('/admin/letters/');
    return response.data.results || response.data as unknown as Letter[];
  }

  async getLetter(id: string): Promise<Letter> {
    const response = await this.client.get<Letter>(`/admin/letters/${id}/`);
    return response.data;
  }

  async createLetter(data: CreateLetterRequest): Promise<Letter> {
    const response = await this.client.post<Letter>('/admin/letters/', data);
    return response.data;
  }

  async updateLetter(id: string, data: UpdateLetterRequest): Promise<Letter> {
    const response = await this.client.patch<Letter>(`/admin/letters/${id}/`, data);
    return response.data;
  }

  async deleteLetter(id: string): Promise<void> {
    await this.client.delete(`/admin/letters/${id}/`);
  }

  // Admin - Letter Types
  async getLetterTypes(): Promise<LetterType[]> {
    const response = await this.client.get<{ results: LetterType[] }>('/admin/letter-types/');
    return response.data.results || response.data as unknown as LetterType[];
  }

  async getLetterType(id: string): Promise<LetterType> {
    const response = await this.client.get<LetterType>(`/admin/letter-types/${id}/`);
    return response.data;
  }

  async createLetterType(data: CreateLetterTypeRequest): Promise<LetterType> {
    const response = await this.client.post<LetterType>('/admin/letter-types/', data);
    return response.data;
  }

  async updateLetterType(id: string, data: CreateLetterTypeRequest): Promise<LetterType> {
    const response = await this.client.patch<LetterType>(`/admin/letter-types/${id}/`, data);
    return response.data;
  }

  async deleteLetterType(id: string): Promise<void> {
    await this.client.delete(`/admin/letter-types/${id}/`);
  }
}

export const apiClient = new APIClient();
