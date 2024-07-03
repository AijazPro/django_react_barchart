// src/api/fetchData.ts
import axios from 'axios';

interface ApiResponse {
  data: {
    [year: string]: {
      [month: string]: {
        [date: string]: number;
      }[];
    }[];
  }[];
  cache_source: string;
  cache_expiry: string;
}

const fetchData = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>('http://localhost:8000/api/data/');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default fetchData;
