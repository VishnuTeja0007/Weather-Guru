// api url and key for weatherapi constants used in this file
const url = "http://api.weatherapi.com/v1"
const api_key = "159ab6317b3f4a6b84c13820250710"
//for popup visibility
let isPopupVisible = false

// empty objects for weather current and forecast
let weatherCurrent = {}
let weatherForecast = {}
//for celicius to fahrenheit conversion button 

let isCelicius = true;

//queries to collect and store in sessionStorage

const queries = []

//! functions start here

function handlePopup(message, Description) {
    const popup = document.querySelector(".error-message")

    // Safety check: ensure popup element exists
    if (!popup) {
        console.error('Error popup element not found in DOM');
        return;
    }

    // If popup is already visible, close it first
    if (isPopupVisible) {
        popup.classList.add('hidden');
    }

    // Display the error popup
    isPopupVisible = true;
    popup.classList.remove('hidden');
    popup.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation fa-2xl" style="color: #ff0000;"></i>
        <h1>Error: ${message}</h1>
        <p>${Description}</p>
        <button class="p-3 bg-red-700 rounded-md text-white" id="close-popup">Close</button>`;

    // Add event listener to close button
    const closePopUpButton = popup.querySelector('#close-popup');
    if (closePopUpButton) {
        closePopUpButton.onclick = () => {
            popup.classList.add('hidden');
            isPopupVisible = false;
        };
    }
}

async function getCurrentWeather(query) {
    const response = await fetch(`${url}/current.json?key=${api_key}&q=${query}`)
    const data = await response.json()
    // console.log(data)
    return data
}
async function getForecastWeather(query, days = 5) {
    const response = await fetch(`${url}/forecast.json?key=${api_key}&q=${query}&days=${days}`)
    const data = await response.json()
    console.log("forecast data", data)
    return data
}


// Function to check for extreme temperatures and show warnings
function checkTemperatureWarnings(weatherData) {
    if (!weatherData || !weatherData.current) {
        return;
    }

    const tempC = weatherData.current.temp_c;
    const location = weatherData.location?.name || 'your location';

    if (tempC > 35) {
        handlePopup(
            'High Temperature Alert! 🌡️', 
            `Temperature in ${location} is ${tempC}°C. It's very hot! Stay hydrated, avoid direct sunlight, and use sun protection.`
        );
    } else if (tempC < 20) {
        handlePopup(
            'Low Temperature Alert! ❄️', 
            `Temperature in ${location} is ${tempC}°C. It's cold! Dress warmly and take precautions against the cold weather.`
        );
    }
}

// Helper function to get background image based on weather condition
const getBackgroundImage = (conditionText) => {
    const text = conditionText.toLowerCase();
    if (text.includes('sunny') || text.includes('clear')) return './assets/sunny.jpg';
    if (text.includes('cloudy') || text.includes('overcast') || text.includes('partly cloudy')) return './assets/cloudy.jpg';
    if (text.includes('rain') || text.includes('drizzle') || text.includes('thunder') || text.includes('storm')) return './assets/rainy.jpg';
    if (text.includes('snow') || text.includes('ice') || text.includes('freezing')) return './assets/winter.png';
    return './assets/sunny.jpg'; // Default to sunny
};

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

    // Change background based on weather condition
    if (current.condition?.text) {
        const backgroundImage = getBackgroundImage(current.condition.text);
        const mainBackground = document.querySelector('.background');
        if (mainBackground) {
            mainBackground.style.backgroundImage = `url('${backgroundImage}')`;
            mainBackground.style.backgroundSize = 'cover';
            mainBackground.style.backgroundPosition = 'center';
            mainBackground.style.backgroundRepeat = 'no-repeat';
        }
    }
}

function displayForecast(forecastData) {
    console.log("displayForecast called", !document.querySelector("#forecast-count"));
    if(!document.querySelector("#forecast-count")){
        const parent = document.querySelector(".forecast-parent-container")
        const sibling = document.querySelector("#forecastContainer")
        // const wchild=`<h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 px-2 sm:px-0">5-Day Forecast</h2> `
    
        const child = document.createElement('h2')
        child.id="forecast-count"
        child.classList.add(...("text-xl md:text-2xl font-bold text-gray-800 mb-4 px-2 sm:px-0".split(" ")))
        child.innerText = "5-Day Forecast"
        console.log(parent.innerText);
        parent.insertBefore(child, sibling)
    
    }
    

    if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) {
        console.error("Invalid forecast data format", forecastData);
        return;
    }

    const forecastDays = forecastData.forecast.forecastday;

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Helper function to get weather emoji
    const getWeatherEmoji = (conditionText) => {
        const text = conditionText.toLowerCase();
        if (text.includes('sunny') || text.includes('clear')) return '☀️';
        if (text.includes('partly cloudy')) return '⛅';
        if (text.includes('cloudy') || text.includes('overcast')) return '☁️';
        if (text.includes('rain') || text.includes('drizzle')) return '🌧️';
        if (text.includes('thunder') || text.includes('storm')) return '⛈️';
        if (text.includes('snow')) return '❄️';
        if (text.includes('mist') || text.includes('fog')) return '🌫️';
        return '🌤️';
    };


    // Process up to 5 days
    const daysToShow = Math.min(forecastDays.length, 5);

    for (let i = 0; i < daysToShow; i++) {
        const day = forecastDays[i];
        const dayData = day.day;
        const astroData = day.astro;

        const weatherEmoji = getWeatherEmoji(dayData.condition.text);

        // Create parentChildObject for each forecast day
        const parentChildObject = {
            dayContainer: {
                parent: document.querySelector(`.forecast-day-${i}`),
                action: 'show' // Special action to show the hidden section
            },
            header: {
                parent: document.querySelector(`.forecast-header-${i}`),
                child: `
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 border-b pb-3 md:pb-4 gap-2">
                        <h2 class="text-lg md:text-xl font-semibold text-gray-800">${formatDate(day.date)}</h2>
                        <span class="text-sm md:text-base text-gray-500 bg-yellow-100 px-3 py-1 rounded-full">${weatherEmoji} ${dayData.condition.text}</span>
                    </div>
                `
            },
            icon: {
                parent: document.querySelector(`.forecast-icon-${i}`),
                child: `<img src="https:${dayData.condition.icon}" alt="${dayData.condition.text}" class="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />`
            },
            mainDetails: {
                parent: document.querySelector(`.forecast-main-details-${i}`),
                child: `
                    <h3 class="text-base md:text-lg font-bold text-yellow-600">
                        Temperature: ${isCelicius ? dayData.avgtemp_c : dayData.avgtemp_f}${isCelicius ? '°C' : '°F'}
                    </h3>
                    <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <p>Max: <span class="font-medium">${isCelicius ? dayData.maxtemp_c : dayData.maxtemp_f}${isCelicius ? '°C' : '°F'}</span></p>
                        <p>Min: <span class="font-medium">${isCelicius ? dayData.mintemp_c : dayData.mintemp_f}${isCelicius ? '°C' : '°F'}</span></p>
                        <p>Humidity: <span class="font-medium">${dayData.avghumidity}%</span></p>
                        <p>Wind: <span class="font-medium">${isCelicius ? dayData.maxwind_kph : dayData.maxwind_mph} ${isCelicius ? 'kph' : 'mph'}</span></p>
                        <p class="col-span-2">UV Index: <span class="font-medium">${dayData.uv || 'N/A'}</span></p>
                    </div>
                `
            },
            astro: {
                parent: document.querySelector(`.forecast-astro-${i}`),
                child: `
                    <div class="status flex justify-between items-center border-b pb-2">
                        <h3 class="text-sm md:text-base font-bold text-purple-600">🌅 Astro Details</h3>
                        <span class="text-xs md:text-sm bg-indigo-100 px-2 py-1 rounded-full">🌙 ${astroData.moon_phase}</span>
                    </div>
                    <div class="text-xs sm:text-sm grid grid-cols-2 gap-x-4 gap-y-2">
                        <p>🌞 Sunrise: <span class="font-medium text-gray-800 block sm:inline">${astroData.sunrise}</span></p>
                        <p>🌇 Sunset: <span class="font-medium text-gray-800 block sm:inline">${astroData.sunset}</span></p>
                        <p>🌝 Moonrise: <span class="font-medium text-gray-800 block sm:inline">${astroData.moonrise}</span></p>
                        <p>🌚 Moonset: <span class="font-medium text-gray-800 block sm:inline">${astroData.moonset}</span></p>
                        <p>🌔 Phase: <span class="font-medium text-gray-800 block sm:inline">${astroData.moon_phase}</span></p>
                        <p>💡 Illumination: <span class="font-medium text-gray-800 block sm:inline">${astroData.moon_illumination}%</span></p>
                    </div>
                `
            },
            wind: {
                parent: document.querySelector(`.forecast-wind-${i}`),
                child: `
                    <h3 class="text-xs sm:text-sm font-semibold text-blue-600 mb-2">🌬️ Wind Info</h3>
                    <p class="text-xs sm:text-sm text-gray-700">Max Wind: <span class="font-medium block sm:inline">${dayData.maxwind_mph} mph / ${dayData.maxwind_kph} kph</span></p>
                `
            },
            precipitation: {
                parent: document.querySelector(`.forecast-precipitation-${i}`),
                child: `
                    <h3 class="text-xs sm:text-sm font-semibold text-cyan-600 mb-2">💧 Precipitation</h3>
                    <p class="text-xs sm:text-sm text-gray-700">Rain: <span class="font-medium">${dayData.totalprecip_mm} mm / ${dayData.totalprecip_in} in</span></p>
                    <p class="text-xs sm:text-sm text-gray-700">Snow: <span class="font-medium">${dayData.totalsnow_cm} cm</span></p>
                `
            },
            visibility: {
                parent: document.querySelector(`.forecast-visibility-${i}`),
                child: `
                    <h3 class="text-xs sm:text-sm font-semibold text-indigo-600 mb-2">🌫️ Visibility</h3>
                    <p class="text-xs sm:text-sm text-gray-700">Avg Visibility: <span class="font-medium block sm:inline">${dayData.avgvis_km} km / ${dayData.avgvis_miles} miles</span></p>
                `
            },
            atmosphere: {
                parent: document.querySelector(`.forecast-atmosphere-${i}`),
                child: `
                    <h3 class="text-xs sm:text-sm font-semibold text-emerald-600 mb-2">☁️ Atmosphere</h3>
                    <p class="text-xs sm:text-sm text-gray-700">Humidity: <span class="font-medium">${dayData.avghumidity}%</span></p>
                    <p class="text-xs sm:text-sm text-gray-700">Rain Chance: <span class="font-medium">${dayData.daily_chance_of_rain}%</span></p>
                `
            },
            summary: {
                parent: document.querySelector(`.forecast-summary-${i}`),
                child: `
                    <p class="text-sm md:text-base text-gray-700">
                        <span class="font-semibold">Summary:</span> 
                        ${dayData.daily_will_it_rain ? `Expect rain with ${dayData.daily_chance_of_rain}% chance. ` : 'No rain expected. '}
                        ${dayData.daily_will_it_snow ? `Snow expected. ` : ''}
                        Average temperature will be ${isCelicius ? dayData.avgtemp_c : dayData.avgtemp_f}${isCelicius ? '°C' : '°F'} with ${dayData.condition.text.toLowerCase()}.
                    </p>
                `
            }
        };

        // Loop through parentChildObject and add child to parent
        for (const key in parentChildObject) {
            const item = parentChildObject[key];
            if (item.parent) {
                if (item.action === 'show') {
                    // Show the hidden forecast day container
                    item.parent.classList.remove('hidden');
                } else {
                    // Use childAddition function to add content
                    childAddition(item.parent, item.child);
                }
            } else {
                console.warn(`Parent element not found for key: ${key} (day ${i})`);
            }
        }
    }

    // Hide any unused forecast day containers
    for (let i = daysToShow; i < 5; i++) {
        const dayContainer = document.querySelector(`.forecast-day-${i}`);
        if (dayContainer) {
            dayContainer.classList.add('hidden');
        }
    }
}


function childAddition(parent, child) {

    parent.innerHTML = child
}

//here the document needs to be loaded to make sure all addEventlisteneres add

document.addEventListener('DOMContentLoaded', function () {
    const searchToggle = document.getElementById('searchToggle');
    const closeSearch = document.getElementById('closeSearch');
    const searchSection = document.getElementById('searchSection');
    const loadingScreen = document.getElementById('loadingScreen');
    const searchHistoryDiv = document.querySelector('.search-history');
    const searchHistoryList = document.querySelector('.search-history-list');
    const searchHistoryDivMobile = document.querySelector('.search-history-mobile');
    const searchHistoryListMobile = document.querySelector('.search-history-list-mobile');
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

    // Search history functions
    function displaySearchHistory(listElement) {
        if (!listElement) return;

        // Get history from sessionStorage
        const historyJSON = sessionStorage.getItem('history');
        const history = historyJSON ? JSON.parse(historyJSON) : [];

        // Clear the list
        listElement.innerHTML = '';

        if (history.length === 0) {
            // Show default message when no history
            const emptyLi = document.createElement('li');
            emptyLi.className = 'text-gray-500 text-sm text-center py-2';
            emptyLi.textContent = 'Search a city';
            listElement.appendChild(emptyLi);
        } else {
            // Display history items (show last 10 items in reverse order - most recent first)
            const recentHistory = history.slice(-10).reverse();

            recentHistory.forEach((city, index) => {
                const li = document.createElement('li');
                li.className = 'text-gray-700 text-sm py-2 px-3 hover:bg-blue-50 rounded-md cursor-pointer transition-colors duration-200 flex items-center gap-2';

                // Add clock iconhandle
                li.innerHTML = `
                    <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${city}</span>
                `;

                // Add click event to search for this city
                li.addEventListener('click', function () {
                    handleSearch(city);
                    hideSearchHistory();
                    hideSearchHistoryMobile();
                });

                listElement.appendChild(li);
            });
        }
    }

    // functions to dynamically show content
    
    function showSearchHistory() {
        if (searchHistoryDiv) {
            displaySearchHistory(searchHistoryList);
            searchHistoryDiv.classList.remove('hidden');
        }
    }
    function hideSearchHistory() {
        if (searchHistoryDiv) {
            searchHistoryDiv.classList.add('hidden');
        }
    }

    function showSearchHistoryMobile() {
        if (searchHistoryDivMobile) {
            displaySearchHistory(searchHistoryListMobile);
            searchHistoryDivMobile.classList.remove('hidden');
        }
    }

    function hideSearchHistoryMobile() {
        if (searchHistoryDivMobile) {
            searchHistoryDivMobile.classList.add('hidden');
        }
    }

    // Toggle search section
    if (searchToggle) {
        searchToggle.addEventListener('click', function () {
            toggleSearchSection(true);
            console.log("search toggle clicked");
        });
    }

    // Close search section
    if (closeSearch) {
        closeSearch.addEventListener('click', function () {
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
        const welcome=document.querySelector(".welcome-tag")
        welcome.remove()
        // Input validation - check for empty, whitespace-only, or invalid input
        if (!searchValue || !searchValue.trim() || !/^[a-zA-Z0-9\s,.-]+$/.test(searchValue.trim())) {
            handlePopup("Input Error", "Please enter a valid city name");
            return;
        }

        queries.push(searchValue);
        sessionStorage.setItem('history', JSON.stringify(queries));

        console.log('Searching for:', searchValue);
        showLoading(); // Show loading screen

        try {
            // Fetch both current weather and forecast data
            const [currentResult, forecastResult] = await Promise.all([
                getCurrentWeather(searchValue),
                getForecastWeather(searchValue, 5)
            ]);

            console.log('Weather data:', currentResult);
            console.log('Forecast data:', forecastResult);

            if (currentResult.error) {
                throw new Error(currentResult.error.message || 'Failed to fetch weather data');
            }

            if (forecastResult.error) {
                throw new Error(forecastResult.error.message || 'Failed to fetch forecast data');
            }

            weatherCurrent = currentResult;
            weatherForecast = forecastResult;

            displayWeather(weatherCurrent);
            displayForecast(weatherForecast);
            
            // Check for temperature warnings
            checkTemperatureWarnings(weatherCurrent);

            // Close toggle search section if open
            if (searchSection && searchSection.classList.contains('opacity-100')) {
                toggleSearchSection(false);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            handlePopup('Weather Data Error', error.message || 'Unable to fetch weather data. Please try again.');
        } finally {
            hideLoading(); // Hide loading screen after data is fetched or error occurs
        }
    }
    // Add event listeners to ALL search inputs
    citySearchInputs.forEach((input, index) => {
        // Determine if this input is in the mobile search section
        const isMobileInput = input.closest('#searchSection') !== null;

        // Show history on focus
        input.addEventListener('focus', function () {
            console.log(`Search input ${index + 1} - focused (${isMobileInput ? 'mobile' : 'desktop'})`);
            if (isMobileInput) {
                showSearchHistoryMobile();
            } else {
                showSearchHistory();
            }
        });

        // Hide history on blur (with a small delay to allow clicking on history items)
        input.addEventListener('blur', function () {
            console.log(`Search input ${index + 1} - blurred (${isMobileInput ? 'mobile' : 'desktop'})`);
            setTimeout(() => {
                if (isMobileInput) {
                    hideSearchHistoryMobile();
                } else {
                    hideSearchHistory();
                }
            }, 200);
        });

        // Handle Enter key press
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchValue = this.value.trim();
                this.value = "";
                console.log(`Search input ${index + 1} - Enter pressed (${isMobileInput ? 'mobile' : 'desktop'})`);
                hideSearchHistory();
                hideSearchHistoryMobile();
                handleSearch(searchValue);
            }
        });
    });

    // Handle location functionality
    function handleLocation() {
        const parent=document.querySelector(".forecast-parent-container")
        const coordinates = [];
        console.log('Getting current location...');
        showLoading(); // Show loading screen

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async function (position) {
                    try {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        console.log('Location:', lat, lon);
                        coordinates.push(lat, lon);
                        const query = coordinates.join(',');
                        console.log(query);

                        // Fetch both current weather and forecast data
                        const [currentResult, forecastResult] = await Promise.all([
                            getCurrentWeather(query),
                            getForecastWeather(query, 5)
                        ]);

                        if (currentResult.error) {
                            throw new Error(currentResult.error.message || 'Failed to fetch weather data');
                        }

                        if (forecastResult.error) {
                            throw new Error(forecastResult.error.message || 'Failed to fetch forecast data');
                        }

                        weatherCurrent = currentResult;
                        weatherForecast = forecastResult;

                        displayWeather(weatherCurrent);
                        displayForecast(weatherForecast);
                        
                        // Check for temperature warnings
                        checkTemperatureWarnings(weatherCurrent);

                        // Close toggle search section if open
                        if (searchSection && searchSection.classList.contains('opacity-100')) {
                            toggleSearchSection(false);
                        }
                    } catch (error) {
                        console.error('Error fetching weather:', error);
                        handlePopup('Location Weather Error', error.message || 'Unable to fetch weather for your location.');
                    } finally {
                        hideLoading(); // Hide loading screen
                    }
                },
                function (error) {
                    console.error('Error getting location:', error);
                    let errorMessage = 'Unable to get your location.';
                    
                    // Provide specific error messages based on error code
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable. Please try again.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out. Please try again.';
                            break;
                        default:
                            errorMessage = 'An unknown error occurred while getting your location.';
                    }
                    
                    handlePopup('Geolocation Error', errorMessage);
                    hideLoading(); // Hide loading screen on geolocation error
                }
            );
        } else {
            handlePopup('Geolocation Not Supported', 'Your browser does not support geolocation. Please search for a city manually.');
            hideLoading(); // Hide loading screen
        }
    }

    // Add event listeners to ALL location buttons
    locationButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            console.log(`Location button ${index + 1} clicked`);
            handleLocation();
        });
    });

    // Close search section when clicking outside
    document.addEventListener('click', function (e) {
        if (searchSection &&
            !searchSection.contains(e.target) &&
            searchToggle &&
            !searchToggle.contains(e.target) &&
            searchSection.classList.contains('opacity-100')) {
            toggleSearchSection(false);
        }

        // Hide desktop search history when clicking outside
        if (searchHistoryDiv &&
            !searchHistoryDiv.contains(e.target) &&
            !Array.from(citySearchInputs).some(input => !input.closest('#searchSection') && input.contains(e.target))) {
            hideSearchHistory();
        }

        // Hide mobile search history when clicking outside
        if (searchHistoryDivMobile &&
            !searchHistoryDivMobile.contains(e.target) &&
            !Array.from(citySearchInputs).some(input => input.closest('#searchSection') && input.contains(e.target))) {
            hideSearchHistoryMobile();
        }
    });

    // Prevent closing when clicking inside search section
    if (searchSection) {
        searchSection.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Prevent desktop search history from closing when clicking inside it
    if (searchHistoryDiv) {
        searchHistoryDiv.addEventListener('mousedown', function (e) {
            e.preventDefault(); // Prevent input blur when clicking history
        });
    }

    // Prevent mobile search history from closing when clicking inside it
    if (searchHistoryDivMobile) {
        searchHistoryDivMobile.addEventListener('mousedown', function (e) {
            e.preventDefault(); // Prevent input blur when clicking history
        });
    }
    document.getElementById("cToF").addEventListener('click', () => {
        if (isCelicius) {
            isCelicius = false;
            displayWeather(weatherCurrent);
            if (weatherForecast && weatherForecast.forecast) {
                displayForecast(weatherForecast);
            }
        }
        else {
            isCelicius = true;
            displayWeather(weatherCurrent);
            if (weatherForecast && weatherForecast.forecast) {
                displayForecast(weatherForecast);
            }
        }
        console.log("conversion triggered", isCelicius)
    })
    // displayWeather(jsonObject)
});
