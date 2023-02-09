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
{
  var hourlyForecastData;
}
  
  function saveData(data) {
    hourlyForecastData = data;
  }
  
  function renderDifferentHourlyForecast(id) {
    const renderers = document.querySelectorAll(".hourly_content");
    renderers.forEach((element) => {
      element.style.display = "none";
    });
    renderForecastByHour(hourlyForecastData, id);
  }
  
  async function getWeatherFirstTime() {
    //Show the loader
    const place = $("#input-home").val();
    const showAlert= (()=>{
      toastr.info("The first time could take a few extra seconds, wait please", "", {
        "toastClass": "toast"
      });
  
    setTimeout(function() {
      toastr.clear();
    }, 5000);
   
    })
    showAlert()
    $(".loader").show();
    //First, get the data from the backend
    Promise.all([
      weatherApi.getWeatherData(place),
      weatherApi.getForecast(place),
      weatherApi.getHourlyForecast(place),
    ])
      .then((data) => {
        renderWeather(data[0].weather);
        renderForecast(data[1].forecast);
        renderForecastByHour(data[2].forecast, 0);
        saveData(data[2].forecast);
      })
      //The element that shows the data is not visible until it gets and draw all the data
      .then(() => {
        $(".loader").fadeOut(500);
        $(".forecast").show();
        $(".home").addClass("hidden");
        $(".app").fadeIn(1000);
        $("body").removeClass(".stop-scrolling");
      })
  
      .catch((error) => {
        // maneja el error aquí
      });
  }
  
  async function getWeather() {
    try {
      const place = $("#input-app").val();
      Promise.all([
        weatherApi.getWeatherData(place),
        weatherApi.getForecast(place),
        weatherApi.getHourlyForecast(place),
      ])
        .then((data) => {
          renderWeather(data[0].weather);
          renderForecast(data[1].forecast);
          saveData(data[2].forecast);
          renderDifferentHourlyForecast(0);
         
        })
        //The element that shows the data is not visible until it gets and draw all the data
  
        .catch((error) => {
          // maneja el error aquí
        });
    } catch (error) {
      console.log(error)
    }
  }
  //This function makes the Input bar use the google api for Location Suggestions
  function makeAutoComplete() {
    try {
      let inputHome = $("#input-home")[0];
      let inputApp = $("#input-app")[0];
  
      const options = {
        fields: ["address_components", "geometry", "icon", "name"],
        types: ["geocode"],
      };
      const autocompleteHome = new google.maps.places.Autocomplete(
        inputHome,
        options
      );
      const autocompleteApp = new google.maps.places.Autocomplete(
        inputApp,
        options
      );
    } catch (error) {
      console.log(error);
    }
  }
  
  
  
  function listeners() {
  
    
    const buttons = document.querySelectorAll(".forecast__card-button");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const div = this.querySelector(".forecast__card");
        const id = div.id;
   
        renderDifferentHourlyForecast(id);
      });
    });
  }
  

  function renderWeather(weather) {
    try {
      $(".temperature").html(`${weather.main.temp} °C in ${weather.name}`);
      $(".feels_like").html(`Wind chill Factor: ${weather.main.feels_like} °C`);
      $(".min_temperature").html(`Minimum: ${weather.main.temp_min} °C`);
      $(".max_temperature").html(`Maximum : ${weather.main.temp_max}°C`);
      $(".humidity").html(`Humidity ${weather.main.humidity}%`);
      $(".wind_speed").html(`Wind : ${weather.wind.speed} km/h `);
      $(".visibility").html(`Visiblity ${weather.visibility}`);
      $(".pressure").html(`Pressure : ${weather.main.pressure} hPa`);
      $(".weather_img").attr(
        "src",
        `../imgs/weather_icons/${weather.weather[0].icon}.svg`
      );
      $(".weather_description").html(
        weather.weather[0].description.replace(
          /^[^a-zA-Z0-9]*[a-zA-Z0-9]/,
          function (match) {
            return match.toUpperCase();
          }
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  function renderForecast(forecast) {
    try {
      const alreadyRenderer = document.querySelectorAll(".forecast__card-button");
      if (alreadyRenderer) {
        alreadyRenderer.forEach((element) => {
          element.remove();
        });
      }
      const template = document.querySelector("#forecast__card_template");
      const forecastContainer = document.querySelector(
        ".forecast__cards__container"
      );
      for (let i = 0; i < forecast.length; i++) {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".forecast__card").id = `${i}`;
        clone.querySelector(".card_day").textContent = forecast[i].day;
        clone.querySelector(".card_dayNumber").textContent =
          forecast[i].dayNumber;
        clone.querySelector(
          ".card_image"
        ).src = `../imgs/weather_icons/${forecast[i].weather[0].icon}.svg`;
        clone.querySelector(".card_weatherDescription").textContent =
          forecast[i].weather[0].description;
        clone.querySelector(".card_temperature").innerHTML =
          '<i class="fa-solid fa-temperature-high"></i>' +
          ` ${forecast[i].main.temp} °C `;
        clone.querySelector(".card_wind").innerHTML =
          '<i class="fa-solid fa-wind"></i>' + `${forecast[i].wind.speed} km/h`;
        clone.querySelector(".card_humedity").innerHTML =
          '<i class="fa-solid fa-droplet"></i>' +
          `${forecast[i].main.humidity} %`;
        forecastContainer.appendChild(clone);
      }
      listeners();
   
    } catch (error) {
      console.log(error);
    }
  }
  function renderForecastByHour(forecast, index) {
    try {
      const template = document.querySelector("#hourly__forecast_template");
  
      forecast[index].forecast.forEach((element) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".hourly__time").textContent = `${element.hour} `;
        clone.querySelector(".hourly__mainInfo").innerHTML = `
          <img src="../imgs/weather_icons/${element.weather[0].icon}.svg" class="hourly__image">
          <p class ="hourly__description">${element.weather[0].description}</p>
          <p class="hourly__temp">${element.main.temp} °C</p>
          
        `;
        clone.querySelector(".hourly__extraInfo").innerHTML = `
          <p class="hourly__max">Minimum : ${element.main.temp_max} °C</p>
          <p class="hourly__min">Maximum :${element.main.temp_min} °C</p>
          <p class="hourly__humidity"> Humedity :${element.main.humidity}% </p>
        `;
        document.querySelector(".hourly__container").appendChild(clone);
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  function initMap() {
    $(document).ready(makeAutoComplete);
  }
  