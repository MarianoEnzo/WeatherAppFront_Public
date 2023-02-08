/* //This file contains all http request 
const weatherApi = {
    async  getWeatherData() {
        try {
          let place = $(".input-city").val();
      
          const response = await fetch(
            `http://127.0.0.1:3333/api/temperature/${place}`
          );
          console.log(response);
          const data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
    },
    async  getForecast() {
        try {
          console.log("ENTRA PRONOSTICO");
          let place = $(".input-city").val();
          const response = await fetch(`http://127.0.0.1:3333/api/forecast/${place}`);
          const data = await response.json();
      
          return data;
        } catch (error) {
          console.log(error);
        }
      }
}
export{weatherApi} */