import axios from 'axios';

const PEXELS_API_KEY = 'TitO9Em3oNs7beyQFL0fhpaTqde6jD5DkrGMUo4pncU4YjZQQbxQoF1H';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export const fetchMealImage = async (mealName) => {
  try {
    const response = await axios.get(PEXELS_API_URL, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: mealName,
        per_page: 1,
      },
    });

    if (response.data.photos.length > 0) {
      return response.data.photos[0].src.large;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    return null;
  }
};