
import axios from 'axios';
export const fetchTrafficImage = async (selectedDate) => {
  if (!selectedDate) return;

  try {
    const response = await axios.get('https://api.data.gov.sg/v1/transport/traffic-images', {
      params: {
        date: selectedDate.toISOString(),
      },
    });

    return response.data.items[0].cameras;
  } catch (error) {
    console.error('Error fetching traffic image:', error);
    throw error;
  }
};