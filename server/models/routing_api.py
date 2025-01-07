import requests

API_KEY = "API"

BASE_URL = "https://api.tomtom.com/routing/1/calculateRoute"

def fetch_route(source, destination, vehicle_type="car"):
    """
    Fetch route details from the TomTom Routing API for given source and destination,
    based on the specified vehicle type.

    Args:
        source (str): Coordinates of the source in the format "lat,lon".
        destination (str): Coordinates of the destination in the format "lat,lon".
        vehicle_type (str): Type of vehicle. Default is "car".

    Returns:
        dict: JSON response from the TomTom API or an error message.
    """
    url = f"{BASE_URL}/{source}:{destination}/json"
    
    params = {
        "key": API_KEY,
        "instructionsType": "coded", 
        "routeRepresentation": "polyline", 
        "travelMode": vehicle_type, 
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status() 
        return response.json() 
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
