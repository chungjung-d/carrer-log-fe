import axios from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateJobSatisfactionImportanceRequest {
  Workload: number;
  Compensation: number;
  Growth: number;
  WorkEnvironment: number;
  WorkRelationships: number;
  WorkValues: number;
}

export interface InitializeJobSatisfactionRequest {
  Workload: number;
  Compensation: number;
  Growth: number;
  WorkEnvironment: number;
  WorkRelationships: number;
  WorkValues: number;
}

export interface CurrentJobSatisfactionResponse {
  workload: number;
  compensation: number;
  growth: number;
  workEnvironment: number;
  workRelationships: number;
  workValues: number;

  workloadImportance: number;
  compensationImportance: number;
  growthImportance: number;
  workEnvironmentImportance: number;
  workRelationshipsImportance: number;
  workValuesImportance: number;

  score: number;
}

export const jobSatisfactionApi = {
  createImportance: async (data: CreateJobSatisfactionImportanceRequest) => {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');

    if (!token) {
      throw new Error('No access token found');
    }

    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Request URL:', `${API_BASE_URL}/job-satisfaction/importance`);
    console.log('Request data:', data);
    console.log('Access token:', token);

    try {
      const response = await axios.post<ApiResponse<void>>(
        `${API_BASE_URL}/job-satisfaction/importance`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          response: error.response,
          config: error.config
        });
        throw error;
      }
      throw error;
    }
  },

  initializeJobSatisfaction: async (data: InitializeJobSatisfactionRequest) => {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');

    if (!token) {
      throw new Error('No access token found');
    }

    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Request URL:', `${API_BASE_URL}/job-satisfaction/init`);
    console.log('Request data:', data);
    console.log('Access token:', token);

    try {
      const response = await axios.post<ApiResponse<void>>(
        `${API_BASE_URL}/job-satisfaction/init`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          response: error.response,
          config: error.config
        });
        throw error;
      }
      throw error;
    }
  },

  getCurrentJobSatisfaction: async (): Promise<ApiResponse<CurrentJobSatisfactionResponse>> => {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');

    if (!token) {
      throw new Error('No access token found');
    }

    try {
      const response = await axios.get<ApiResponse<CurrentJobSatisfactionResponse>>(
        `${API_BASE_URL}/job-satisfaction/current`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          response: error.response,
          config: error.config
        });
        throw error;
      }
      throw error;
    }
  },
}; 