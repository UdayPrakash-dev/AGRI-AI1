const apiKey = '';

document.getElementById('get-weather').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  getWeather(city);
});



function getWeatherIcon(condition) {
  const key = condition.toLowerCase();
  if (key.includes('clear')) return 'icons/sun.png';
  if (key.includes('cloud')) return 'icons/cloud.png';
  if (key.includes('rain')) return 'icons/rain.png';
  if (key.includes('snow')) return 'icons/snow.png';
  if (key.includes('thunder')) return 'icons/thunder.png';
  if (key.includes('drizzle')) return 'icons/drizzle.png';
  if (key.includes('mist') || key.includes('fog') || key.includes('haze')) return 'icons/mist.png';
  if (key.includes('wind')) return 'icons/wind.png';
  return 'icons/default.png';
}


function displayTodayWeather(city, season, weather) {
  const container = document.getElementById('today-forecast');
  const condition = weather.weather[0].description;
  const iconPath = getWeatherIcon(condition);

  container.innerHTML = `
    <h2>Today's Weather in ${city}</h2>
    <img src="${iconPath}" alt="${condition}" style="width: 80px; height: 80px;">
    <p><strong>Season:</strong> ${season}</p>
    <p><strong>Temperature:</strong> ${weather.main.temp} °C</p>
    <p><strong>Condition:</strong> ${condition}</p>
  `;
}


function displayFiveDayForecast(list) {
  const dailyData = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) dailyData[date] = [];
    dailyData[date].push(item);
  });

  const container = document.getElementById('five-day-forecast');
  container.innerHTML = '';

  const dates = Object.keys(dailyData).slice(1, 6);

  dates.forEach(date => {
    const dayData = dailyData[date];
    const avgTemp = (dayData.reduce((sum, d) => sum + d.main.temp, 0) / dayData.length).toFixed(1);
    const condition = dayData[0].weather[0].description;
    const iconPath = getWeatherIcon(condition);

    container.innerHTML += `
      <div class="day">
        <h3>${date}</h3>
        <img src="${iconPath}" alt="${condition}" style="width: 60px; height: 60px;">
        <p><strong>Temp:</strong> ${avgTemp} °C</p>
        <p><strong>Condition:</strong> ${condition}</p>
      </div>
    `;
  });
}



async function getWeather(city) {
  try {
    // Fetch 5-day forecast (3-hour intervals)
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    // Show today’s season
    const season = getSeason(new Date());
    // Extract today's weather (first item in list)
    const todayWeather = data.list[0];

    displayTodayWeather(city, season, todayWeather);

    displayFiveDayForecast(data.list);

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function getSeason(date) {
  const month = date.getMonth() + 1; // 1-12
  if ([12, 1, 2].includes(month)) return 'Winter';
  if ([3, 4, 5].includes(month)) return 'Spring';
  if ([6, 7, 8].includes(month)) return 'Summer';
  if ([9, 10, 11].includes(month)) return 'Autumn';
  return '';
}

function displayTodayWeather(city, season, weather) {
  const container = document.getElementById('today-forecast');
  container.innerHTML = `
    <h2>Today's Weather in ${city}</h2>
    <p><strong>Season:</strong> ${season}</p>
    <p><strong>Temperature:</strong> ${weather.main.temp} °C</p>
    <p><strong>Condition:</strong> ${weather.weather[0].description}</p>
  `;
}

function displayFiveDayForecast(list) {
  // Group data by day
  const dailyData = {};

  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) dailyData[date] = [];
    dailyData[date].push(item);
  });

  const container = document.getElementById('five-day-forecast');
  container.innerHTML = '';

  // Get 5 unique days starting from tomorrow
  const dates = Object.keys(dailyData).slice(1, 6);

  dates.forEach(date => {
    // Average temperature and pick first weather description of the day
    const dayData = dailyData[date];
    const avgTemp = (dayData.reduce((sum, d) => sum + d.main.temp, 0) / dayData.length).toFixed(1);
    const condition = dayData[0].weather[0].description;

    container.innerHTML += `
      <div class="day">
        <h3>${date}</h3>
        <p><strong>Temp:</strong> ${avgTemp} °C</p>
        <p><strong>Condition:</strong> ${condition}</p>
      </div>
    `;
  });
}
