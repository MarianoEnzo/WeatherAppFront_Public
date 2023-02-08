const weatherApi = {
    async getWeatherData(place) {
      try {
        const response = await fetch(
          `https://weatherapp-j8vj.onrender.com/api/temperature/${place}/en`
        );
  
        if (response.status == 200) {
          const weather = await response.json();
  
          return weather;
        }
        return null;
      } catch (error) {
        console.log(error);
      }
    },
    async getForecast(place) {
      try {
        const response = await fetch(
          `https://weatherapp-j8vj.onrender.com/api/forecast/${place}/en`
        );
        const data = await response.json();
  
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async getHourlyForecast(place) {
      try {
        const response = await fetch(
          `https://weatherapp-j8vj.onrender.com/api/hourlyForecast/${place}/en`
        );
  
        const data = await response.json();
  
        return data;
      } catch (error) {}
    },
  };
  export default weatherApi;