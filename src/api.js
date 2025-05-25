import axios from 'axios';

const API_BASE_URL = 'https://crypto-production-5a21.up.railway.app' || 'http://localhost:8080';
// const API_BASE_URL = 'http://localhost:8080';

export const fetchCryptoData = async (id, timeframe) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crypto/${id}/${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const fetchList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crypto/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const fetchCoin = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin', error);
    throw error;
  }
}