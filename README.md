# FedEX SMART Hackathon: Dynamic Route Optimization and Emission Reduction System

## Problem Statement
A critical challenge in logistics and transportation is optimizing vehicle routes to ensure timely deliveries while minimizing environmental impact. FedEx seeks to develop an advanced dynamic routing system that leverages real-time traffic, weather, and vehicle data to recommend the most efficient routes. Additionally, the system should estimate vehicle emissions for each route to help reduce the company's carbon footprint.

## Objective
- Develop a Python-based dynamic routing system using real-time data from various applicable APIs.
- Optimize vehicle routes considering traffic, weather, and vehicle-specific details.
- Estimate and minimize vehicle emissions for each route.
- Ensure the system is user-friendly and accessible.

## Project Structure
```
client/
	package.json
	public/
		index.html
		manifest.json
		robots.txt
	README.md
	src/
		App.css
		App.js
		App.test.js
		components/
			AirQuality.jsx
			RouteDetails.jsx
			RouteDisplay.jsx
			RouteForm.jsx
			RouteHeader.jsx
			RouteInstructions.jsx
			SuggestionsList.jsx
			TrafficIncidents.jsx
		index.css
		index.js
		reportWebVitals.js
		setupTests.js
	tailwind.config.js
server/
	__pycache__/
	app.py
	meteorological_api.py
	requirements.txt
	routing_api.py
	traffic_api.py
```

## Client
The client-side application is built using React and includes the following key components:
- **RouteDisplay**: Main component that integrates map display and route details.
- **RouteHeader**: Handles user inputs for source, destination, and vehicle type.
- **RouteDetails**: Displays summary of the route including distance, travel time, and environmental data.
- **RouteInstructions**: Provides step-by-step navigation instructions.
- **AirQuality**: Fetches and displays air quality data along the route.
- **TrafficIncidents**: Fetches and displays traffic incidents along the route.
- **WeaterDetails**: Fetches and displays weather details along the route.

## Server
The server-side application is built using Flask and includes the following key modules:
- **app.py**: Main application file that handles API requests for traffic incidents, route details, and air quality data.
- **routing_api.py**: Fetches route details from the TomTom Routing API.
- **traffic_api.py**: Fetches real-time traffic incident details from the TomTom Traffic API.
- **meteorological_api.py**: Fetches air quality data from the AQICN API.

## Setup and Installation
1. **Client Setup**:
    - Navigate to the 

client

 directory.
    - Install dependencies: `npm install`
    - Start the development server: `npm start`
    - Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

2. **Server Setup**:
    - Navigate to the 

server

 directory.
    - Create a virtual environment: `python -m venv venv`
    - Activate the virtual environment:
        - On Windows: `venv\Scripts\activate`
        - On macOS/Linux: `source venv/bin/activate`
    - Install dependencies: `pip install -r requirements.txt`
    - Start the Flask server: 

python app.py


    - The server will run on [http://localhost:5000](http://localhost:5000).

## Usage
1. Enter the source and destination addresses in the input fields.
2. Select the vehicle type from the dropdown menu.
3. Click on the "Get Route" button to fetch the optimal route.
4. View the route details, including distance, travel time, traffic incidents, air quality, and weather conditions.
5. The system will also estimate vehicle emissions for the selected route.

## APIs Used
- **TomTom API**: For real-time traffic data and route generation.
- **AQICN API**: For air quality data.
- **Open-Meteo API**: For weather data.