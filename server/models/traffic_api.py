import requests

# Replace with your actual TomTom API key
API_KEY = "bCgG47VKka8a1fdVumQj8hIyfjsjbsSA"

# Base URL for Traffic Incident Details API
BASE_URL = "https://api.tomtom.com/traffic/services/4/incidentDetails/s3"

def fetch_traffic_incidents(bounding_box):
    """
    Fetch real-time traffic incident details for a given bounding box.
    
    Args:
        bounding_box (str): The bounding box coordinates in the format "southLat,westLon,northLat,eastLon".
    
    Returns:
        dict: JSON response from the TomTom API.
    """
    # Construct the full API URL
    url = f"{BASE_URL}/{bounding_box}/22/-1/json"
    
    # Parameters for the API request
    params = {
        "key": API_KEY,
        "projection": "EPSG4326",  # Standard geographic projection
        "originalPosition": "true",  # Include original incident position
    }

    try:
        # Make the API request
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        return response.json()  # Return the JSON response
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}  # Return the error as JSON
