
const url="http://api.weatherapi.com/v1"
const api_key="159ab6317b3f4a6b84c13820250710"

async function getCurrentWeather(query){
    const response=await fetch(`${url}/current.json?key=${api_key}&q=${query}`)
    const data=await response.json()
    // console.log(data)
    return data
}
async function getForecastWeather(query){
    const response =await fetch(`${url}/forecast.json?key=${api_key}&q=${query}`)
    const data=await response.json()
    console.log("forecast data",data)
    return data
}

let weatherCurrent={}
let weatherForecast={}

class WeatherData {
    constructor(data) {
      const {
          name,
          region,
          country,
          lastUpdated,
          tempC,
        tempF,
        condition,
        icon,
        wind,
        atmosphere,
        feelsLike,
        windChill,
        heatIndex,
        dewPoint,
        precipitation,
        visibility,
      } = data;
  
      this.temperature = { c: tempC, f: tempF };
      this.location = { name, region, country, lastUpdated };
      this.currentWeather = {
        status: condition,
        icon,
        wind,
        atmosphere,
        temperature: { feelsLike, windChill, heatIndex, dewPoint },
        visibility: { precipitation, value: visibility },
      };
    }
  
    // example method
    summary() {
      return `${this.location.name}: ${this.currentWeather.status}, ${this.temperature.c}°C`;
    }
  }

// const weatherAtUser= new WeatherData(jsonObject.location.name,jsonObject.location.region,jsonObject.location.);
  
let isCelicius=true;
function displayWeather(weather) {
    console.log("displayCalled", weather); // Log the full weather object to check its structure
    
    if (!weather || !weather.current || !weather.location) {
        console.error("Invalid weather data format", weather);
        return;
    }

    const current = weather.current;
    const location = weather.location;

    const parentChildObject = {
        location: {
            parent: document.querySelector(".location-details"),
            child: `<h1 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
                       ${location.name}, ${location.region || ''} ${location.country}
                    </h1>
                    <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        ${current.last_updated}
                    </span>`
        },
        icon: {
            parent: document.querySelector(".weather-icon"),
            child: current.condition?.icon 
                ? `<img src="https:${current.condition.icon}" alt="${current.condition.text || 'weather icon'}" class="w-full h-full object-contain">`
                : '<div class="text-gray-500">No icon available</div>'
        },
        temperature: {
            parent: document.querySelector(".weather-details"),
            child: `<h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800">
                       ${isCelicius ? current.temp_c : current.temp_f}${isCelicius ? "°C" : "°F"}
                    </h1>
                    <h2 class="text-xl sm:text-2xl md:text-3xl text-gray-600">
                        ${current.condition?.text || 'N/A'}
                    </h2>`
        },
        windSpeed: {
            parent: document.querySelector(".wind-details"),
            child: `<p class="text-sm sm:text-base text-gray-600">
                       Wind Speed: ${isCelicius ? current.wind_kph : current.wind_mph} ${isCelicius ? "kph" : "mph"}
                    </p>
                    <p class="text-sm sm:text-base text-gray-600">
                        Direction: ${current.wind_dir || 'N/A'}
                    </p>`
        },
        atmospheric: {
            parent: document.querySelector(".atmospheric"),
            child: `<p class="text-sm sm:text-base text-gray-600">
                       Humidity: ${current.humidity || 'N/A'}%
                    </p>
                    <p class="text-sm sm:text-base text-gray-600">
                        Pressure: ${isCelicius ? current.pressure_mb : current.pressure_in} ${isCelicius ? "mb" : "in"}
                    </p>`
        },
        temperatureDetails: {  // Changed from duplicate 'temperature' key
            parent: document.querySelector(".temperature"),
            child: `<p class="text-sm sm:text-base text-gray-600">
                       Feels Like: ${isCelicius ? current.feelslike_c : current.feelslike_f}${isCelicius ? "°C" : "°F"}
                    </p>
                    <p class="text-sm sm:text-base text-gray-600">
                        Wind Chill: ${isCelicius ? current.windchill_c : current.windchill_f}${isCelicius ? "°C" : "°F"}
                    </p>
                    <p class="text-sm sm:text-base text-gray-600">
                        Heat Index: ${isCelicius ? current.heatindex_c : current.heatindex_f}${isCelicius ? "°C" : "°F"}
                    </p>
                    <p class="text-sm sm:text-base text-gray-600">
                        Dew Point: ${isCelicius ? current.dewpoint_c : current.dewpoint_f}${isCelicius ? "°C" : "°F"}
                    </p>`
        },
        visibility: {
            parent: document.querySelector(".visibility"),
            child: `<p class="text-sm sm:text-base text-gray-600">
                       Precipitation: ${current.precip_mm || 0} mm
                    </p>
                    <p class="text-sm sm:text-base text-gray-600">
                        Visibility: ${isCelicius ? (current.vis_km + " km") : (current.vis_miles + " miles")}
                    </p>`
        }
    };      

    for (const key in parentChildObject) {
        const item = parentChildObject[key];
        if (item.parent) {
            item.parent.innerHTML = item.child;
        } else {
            console.warn(`Parent element not found for key: ${key}`);
        }
    }
}
function childAddition(parent,child){
    parent.innerHTML=child
}


document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('searchToggle');
    const closeSearch = document.getElementById('closeSearch');
    const searchSection = document.getElementById('searchSection');
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Get ALL search inputs and location buttons using querySelectorAll
    const citySearchInputs = document.querySelectorAll('input[type="text"]#citySearch, input[placeholder*="city"]');
    const locationButtons = document.querySelectorAll('#locationButton, .location-button');

    // Loading screen functions
    function showLoading() {
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            console.log('Loading screen shown');
        }
    }

    function hideLoading() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            console.log('Loading screen hidden');
        }
    }

    // Toggle search section
    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            toggleSearchSection(true);
            console.log("search toggle clicked");
        });
    }

    // Close search section
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            toggleSearchSection(false);
            console.log("x mark clicked");
        });
    }

    // Function to toggle search section
    function toggleSearchSection(show) {
        if (!searchSection) return;
        
        if (show) {
            searchSection.classList.remove('h-0', 'opacity-0');
            searchSection.classList.add('h-auto', 'opacity-100', 'py-4');
            // Focus on the search input inside the toggle section
            const toggleSearchInput = searchSection.querySelector('input[type="text"]');
            if (toggleSearchInput) {
                setTimeout(() => {
                    toggleSearchInput.focus();
                }, 300);
            }
        } else {
            searchSection.classList.add('h-0', 'opacity-0');
            searchSection.classList.remove('h-auto', 'opacity-100', 'py-4');
            // Clear all search inputs
            citySearchInputs.forEach(input => {
                input.value = '';
            });
        }
    }

    // Handle search functionality
    async function handleSearch(searchValue) {
        if (!searchValue) return;
        
        console.log('Searching for:', searchValue);
        showLoading(); // Show loading screen
        
        try {
            const result = await getCurrentWeather(searchValue);
            console.log('Weather data:', result);
            if (result.error) {
                throw new Error(result.error.message || 'Failed to fetch weather data');
            }
            weatherCurrent = result;
            displayWeather(weatherCurrent);
            
            // Close toggle search section if open
            if (searchSection && searchSection.classList.contains('opacity-100')) {
                toggleSearchSection(false);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            alert(`Error: ${error.message}`);
        } finally {
            hideLoading(); // Hide loading screen after data is fetched or error occurs
        }
    }

    // Add event listeners to ALL search inputs
    citySearchInputs.forEach((input, index) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchValue = this.value.trim();
                this.value=""
                console.log(`Search input ${index + 1} - Enter pressed`);
                handleSearch(searchValue);
            }
        });
    });

    // Handle location functionality
    function handleLocation() {
        const coordinates = [];
        console.log('Getting current location...');
        showLoading(); // Show loading screen
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async function(position) {
                    try {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        console.log('Location:', lat, lon);
                        coordinates.push(lat, lon);
                        const query = coordinates.join(',');
                        console.log(query);
                        
                        const result = await getCurrentWeather(query);
                        if (result.error) {
                            throw new Error(result.error.message || 'Failed to fetch weather data');
                        }
                        
                        weatherCurrent = result;
                        displayWeather(weatherCurrent);
                        
                        // Close toggle search section if open
                        if (searchSection && searchSection.classList.contains('opacity-100')) {
                            toggleSearchSection(false);
                        }
                    } catch (error) {
                        console.error('Error fetching weather:', error);
                        alert(`Error: ${error.message}`);
                    } finally {
                        hideLoading(); // Hide loading screen
                    }
                },
                function(error) {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services.');
                    hideLoading(); // Hide loading screen on geolocation error
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            hideLoading(); // Hide loading screen
        }
    }

    // Add event listeners to ALL location buttons
    locationButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`Location button ${index + 1} clicked`);
            handleLocation();
        });
    });

    // Close search section when clicking outside
    document.addEventListener('click', function(e) {
        if (searchSection && 
            !searchSection.contains(e.target) && 
            searchToggle && 
            !searchToggle.contains(e.target) && 
            searchSection.classList.contains('opacity-100')) {
            toggleSearchSection(false);
        }
    });

    // Prevent closing when clicking inside search section
    if (searchSection) {
        searchSection.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    document.getElementById("cToF").addEventListener('click',()=>{
        if(isCelicius){
            isCelicius=false;
            displayWeather(weatherCurrent)   
        }
        else{
            isCelicius=true
            displayWeather(weatherCurrent)
        }
        console.log("conversion triggered",isCelicius)
    })
    // displayWeather(jsonObject)
});
