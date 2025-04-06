import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateJobSatisfactionImportanceRequest {
  Workload: number;
  Compensation: number;
  Growth: number;
  WorkEnvironment: number;
  WorkRelationships: number;
  WorkValues: number;
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
      const response = await axios.post(
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
}; 