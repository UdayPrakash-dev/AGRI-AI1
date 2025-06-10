const apiKey = '';

document.getElementById('get-weather').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  getWeather(city);
});

// Map condition string to icon path
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

// Get current season based on month
function getSeason(date) {
  const month = date.getMonth() + 1;
  if ([12, 1, 2].includes(month)) return 'Winter';
  if ([3, 4, 5].includes(month)) return 'Spring';
  if ([6, 7, 8].includes(month)) return 'Summer';
  if ([9, 10, 11].includes(month)) return 'Autumn';
  return '';
}

// Display today's weather with icon
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

function formatDate(dateStr) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString('en-US', options);
}


// Display 5-day forecast with icons
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
        <h3>${formatDate(date)}</h3>
        <img src="${iconPath}" alt="${condition}" style="width: 60px; height: 60px;">
        <p><strong>Temp:</strong> ${avgTemp} °C</p>
        <p><strong>Condition:</strong> ${condition}</p>
      </div>
    `;
  });
}

// Fetch weather data from API
async function getWeather(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    const season = getSeason(new Date());
    const todayWeather = data.list[0];

    displayTodayWeather(city, season, todayWeather);
    displayFiveDayForecast(data.list);

  } catch (error) {
    alert('Error: ' + error.message);
  }
}
