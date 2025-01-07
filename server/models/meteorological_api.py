import requests

# Replace with your actual AQICN API key
API_KEY = "64c257941e73405c757f6edae34e92e33bb99aa4"

# Base URL for the AQICN API
BASE_URL = "https://api.waqi.info/feed/geo"

def fetch_nearest_air_quality(lat, lon):
    """
    Fetch the nearest available air quality data for a given location (latitude and longitude).

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.

    Returns:
        dict: JSON response from the AQICN API or an error message.
    """
    # Construct the full API URL
    url = f"{BASE_URL}:{lat};{lon}/"
    
    # Parameters for the API request
    params = {
        "token": API_KEY,
    }

    try:
        # Make the API request
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        return response.json()  # Return the JSON response
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}  # Return the error as JSON
