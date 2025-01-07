import requests

API_KEY = "API"

BASE_URL = "https://api.tomtom.com/traffic/services/4/incidentDetails/s3"

def fetch_traffic_incidents(bounding_box):
    """
    Fetch real-time traffic incident details for a given bounding box.
    
    Args:
        bounding_box (str): The bounding box coordinates in the format "southLat,westLon,northLat,eastLon".
    
    Returns:
        dict: JSON response from the TomTom API.
    """
    url = f"{BASE_URL}/{bounding_box}/22/-1/json"
    
    params = {
        "key": API_KEY,
        "projection": "EPSG4326",  
        "originalPosition": "true",  
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  
        return response.json() 
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}  
