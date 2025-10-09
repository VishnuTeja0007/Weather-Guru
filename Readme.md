# Weather Guru
This web application is a frontend project that gets current and forecast weather for 5 days starting including today. This takes either a city name or location coordinates by using browsers geolocation object. The main heart is the weatherapi.com their api is used in here to develop this website.

## Features

Current Weather Display: View real-time temperature, weather conditions, humidity, wind speed.
Location-based Weather: Use your current location for instant weather updates
City Search: Search for weather information by city name or using location button
Responsive Design: Works seamlessly on desktop, tablet, and mobile devices
Weather Icons: Visual weather condition indicators using Font Awesome icons
Search History: Keep track of previously searched locations

## Technology Stack or Tools Used

1. HTML5
2. Vanilla JavaScript
3. Tailwind CSS
4. Font Awesome
5. Weather API
6. Responsive Design

## Project Structure
This project is a simple webpage using html, tailwind, vanilla css, js which is not very complex and can easily understood by looking at root directory . The root directory contains a folder Asssets and images folder inside of this for images organising. . The main code files are present in the root folder.


## Installation

1. Clone the git repository using git commands https://github.com/VishnuTeja0007/Weather-Guru.git
   and  git clone cd WeatherAppProject
2. initialise node package manger using npm init -y
3. run npm install tailwindcss @tailwindcss/cli
4. npx @tailwindcss/cli -i ./input.css -o ./output.css --watch

## Usage

1. Development Server:
    i. Use the Live Server extension in VS Code to run the development server
    ii. Open `src/index.html` in your browser

2. Using the Application:
   i. Enter a city name or click get location in the search bar
   ii. Click the "Use Current Location" button to get weather for your current position
   iii. View detailed weather information including temperature, conditions, humidity, and wind speed

## API Integration

This application uses weather data from a weather API service. Make sure to:
1. Sign up for a weather API service (like WeatherAPI, OpenWeatherMap, etc.)
2. Obtain an API key
3. Update the JavaScript code with your API credentials

## NOTE:
 This project doesnt contain the tailwind css node modules so it's better to install them using cdn or npm. The sample output css file is given in this project running the same output.css in the "npx @tailwindcss/cli -i ./input.css -o ./output.css --watch" command gives error. !! import tailwind css in your vanilla css file if you want to make your own styling use tailwind docs.


## Contributing

Feel free to fork this project and submit pull requests for improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Contact

For any queries contact 1.vishnuteja98765@gmail.com, 2. https://www.linkedin.com/in/vishnu-teja-cheepati-055244252 3. https://vishnu-teja-portfolio.netlify.app/ 4. https://github.com/VishnuTeja0007/