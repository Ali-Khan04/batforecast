const getData = function (city) {
  fetch(
    `http://api.weatherstack.com/current?access_key=6f27a55783ec90daab2ccae801b8d07e&query=${city}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      const { temperature: temp, humidity } = data.current;
      const {
        weather_descriptions: [description],
        weather_icons: [icon],
      } = data.current;
      const cityName = data.location.name;

      document.querySelector(".cityName").textContent = `City: ${cityName}`;
      document.querySelector(".icon img").src = icon;
      document.querySelector(".description").textContent = description;
      document.querySelector(".temp").textContent = `${temp} °C`;
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
};

getData("Islamabad");
