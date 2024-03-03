async function parseWeatherData(response) {
  try {
    const data = await response;

    const json = await data.json();

    const location = {
      resolvedAddress: json.resolvedAddress,
      days: [],
    };

    json.days.forEach((day, index) => {
      if (index <= 7) {
        const obj = {
          date: day.datetime,
          temp: day.temp,
          tempmin: day.tempmin,
          tempmax: day.tempmax,
          conditions: day.conditions,
          description: day.description,
          icon: day.icon,
        };

        location.days.push(obj);
      }
    });

    console.log(location);
  } catch (err) {
    alert("Please enter a valid location");
  }
}

async function getWeather(location) {
  try {
    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KZB76SZB8M6YGEES94J6VW5R9&contentType=json`
    );
    return parseWeatherData(response);
  } catch (err) {
    console.log(err);
  }
}

getWeather("Chabickistan");
