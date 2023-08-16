
import axios from 'axios';
export const fetchLocations = async (selectedDate) => {
    if (!selectedDate) return;
    try {
      const dateFormater = selectedDate.toISOString().slice(0, 19);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert the date to the desired format

        const response = await axios.get('https://api.data.gov.sg/v1//transport/traffic-images', {
          params: {
          date_time: dateFormater,
          date: formattedDate,
        },
      });
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };