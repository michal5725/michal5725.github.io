// Mój własny klucz API
const API_KEY = '912c7cbfa253140fc0858f806e7b07cd';

document.getElementById('weatherBtn').addEventListener('click', function() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert('Wprowadź nazwę miasta!');
    return;
  }
  getCurrentWeather(city);
  getForecast(city);
});

function getCurrentWeather(city) {
  const xhr = new XMLHttpRequest();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log(data);
      displayCurrentWeather(data);
    } else {
      document.getElementById('results').innerHTML = '<p>Błąd podczas pobierania bieżącej pogody.</p>';
    }
  };
  xhr.send();
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci lub niepoprawna odpowiedź API');
      }
      return response.json();
    })
    .then(data => {
      console.log("Dane prognozy (forecast):", data);
      displayForecast(data);
    })
    .catch(error => {
      console.error("Błąd podczas pobierania prognozy:", error);
      document.getElementById('results').innerHTML +=
        '<p>Błąd podczas pobierania prognozy.</p>';
    });
}

function displayCurrentWeather(data) {
  const results = document.getElementById('results');
  results.innerHTML = `
        <h2>Bieżąca pogoda w ${data.name}</h2>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Opis: ${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
  const results = document.getElementById('results');
  let forecastHtml = '<h2>Prognoza na 5 dni</h2><ul>';
  for (let i = 0; i < data.list.length; i += 8) {
    const item = data.list[i];
    const date = new Date(item.dt * 1000).toLocaleDateString('pl-PL');
    forecastHtml += `<li>${date}: ${item.main.temp}°C, ${item.weather[0].description}</li>`;
  }
  forecastHtml += '</ul>';
  results.innerHTML += forecastHtml;
}
