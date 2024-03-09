import dayjs from "dayjs";

function handleDOM(location) {
  const selectedLocation = location.resolvedAddress;

  location.days.forEach((day, index) => {
    const lowTemp = `L: ${day.tempmin}`;
    const maxTemp = `H: ${day.tempmax}`;
    const currentTemp = day.temp;
    const conditions = day.conditions;
    const description = day.description;
    const icon = day.icon;
    const date = dayjs(day.date).format("ddd");

    if (index === 0) {
      createDOMElement("today-weather", "enteredLocation", selectedLocation);
      createDOMElement("today-weather", "currentTemp", currentTemp, "temp");
      createDOMElement("today-weather", "currentConditions", conditions);
      createDOMElement("today-weather", "todayLowTemp", lowTemp, "temp");
      createDOMElement("today-weather", "todayMaxTemp", maxTemp, "temp");
      createDOMElement("today-weather", "currentDescription", description);
    } else {
      createDOMElement(`day-${index}`, `day${index}Date`, date);
      createDOMElement(`day-${index}`, `day${index}Icon`, "", null, icon);
      createDOMElement(`day-${index}`, `day${index}Low`, lowTemp, "temp");
      createDOMElement(`day-${index}`, `day${index}Max`, maxTemp, "temp");
    }
  });

  switchTempListener();
}

function switchTempListener(element, text) {
  const switchBtn = document.querySelector(".switcher");
  switchBtn.removeEventListener("click", switchTemps);
  switchBtn.addEventListener("click", switchTemps);
}

function switchTemps() {
  const switchBtn = document.querySelector(".switcher");
  if (!switchBtn.classList.contains("fahrenheit")) {
    switchBtn.classList.add("celsius");
  }
  const temps = document.querySelectorAll(".temp");

  temps.forEach((temp, index) => {
    if (index === 0) {
      let num = temp.innerText;
      num = num.substring(0, num.length - 1);

      if (switchBtn.classList.contains("celsius")) {
        const fahrenheit = Math.round(((num * 9) / 5 + 32) * 10) / 10;
        temp.innerText = fahrenheit + "°";
      } else if (switchBtn.classList.contains("fahrenheit")) {
        const celsius = Math.round((((num - 32) * 5) / 9) * 10) / 10;
        temp.innerText = celsius + "°";
      }
    }

    if (index !== 0) {
      const array = temp.innerText.split(":");
      array[1] = array[1].substring(0, array[1].length - 1);

      if (switchBtn.classList.contains("celsius")) {
        const fahrenheit = Math.round(((array[1] * 9) / 5 + 32) * 10) / 10;
        temp.innerText = array[0] + ": " + fahrenheit + "°";
        if (index === temps.length - 1) {
          switchBtn.classList.remove("celsius");
          switchBtn.classList.add("fahrenheit");
          switchBtn.innerText = "Celsius";
        }
      } else if (switchBtn.classList.contains("fahrenheit")) {
        const celsius = Math.round((((array[1] - 32) * 5) / 9) * 10) / 10;
        temp.innerText = array[0] + ": " + celsius + "°";
        if (index === temps.length - 1) {
          switchBtn.classList.remove("fahrenheit");
          switchBtn.classList.add("celsius");
          switchBtn.innerText = "Fahrenheit";
        }
      }
    }
  });
}

function createDOMElement(parent, className, text, temp, icon) {
  const target = document.querySelector(`.${parent}`);

  if (document.querySelector(`.${className}`)) {
    const removeEl = document.querySelector(`.${className}`);
    target.removeChild(removeEl);
  }

  const element = document.createElement("div");

  element.classList.add(`${className}`);
  element.innerHTML = `${text}`;
  if (temp) {
    element.innerText = `${text}°`;
    element.classList.add("temp");
  }
  target.appendChild(element);
}

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

    handleDOM(location);
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

const weatherLookupDOM = (function () {
  const submitBtn = document.getElementById("submit-button");
  const input = document.getElementById("location");
  const switchBtn = document.querySelector(".switcher");

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getWeather(input.value);
    input.value = "";

    if (switchBtn.classList.contains("fahrenheit")) {
      switchBtn.classList.remove("fahrenheit");
      switchBtn.classList.add("celsius");
      switchBtn.innerText = "Fahrenheit";
    }
  });
})();
