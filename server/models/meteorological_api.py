import requests

API_KEY = "API"

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
    url = f"{BASE_URL}:{lat};{lon}/"
    
    params = {
        "token": API_KEY,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  
        return response.json() 
    except requests.exceptions.RequestException as e:
        return {"error": str(e)} 
