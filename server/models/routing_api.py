import requests

# Replace with your actual TomTom API key
API_KEY = "bCgG47VKka8a1fdVumQj8hIyfjsjbsSA"

# Base URL for the TomTom Routing API
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
    # Construct the full API URL
    url = f"{BASE_URL}/{source}:{destination}/json"
    
    # Parameters for the API request
    params = {
        "key": API_KEY,
        "instructionsType": "coded",  # Simplified instructions format
        "routeRepresentation": "polyline",  # Return the polyline for the route
        "travelMode": vehicle_type,  # Specify the travel mode
    }

    try:
        # Make the API request
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        return response.json()  # Return the JSON response
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}  # Return the error as JSON
