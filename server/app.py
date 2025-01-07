from flask import Flask, request, jsonify
from flask_cors import CORS
from models.traffic_api import fetch_traffic_incidents
from models.routing_api import fetch_route
from models.meteorological_api import fetch_nearest_air_quality


app = Flask(__name__)
CORS(app) 

@app.route('/traffic-incidents', methods=['GET'])
def traffic_incidents():
    """
    Handle API requests for traffic incidents.
    """
    # Get bounding box from the request arguments
    bounding_box = request.args.get('bounding_box')
    if not bounding_box:
        return jsonify({"error": "Missing 'bounding_box' parameter"}), 400

    # Fetch traffic incidents using the function from traffic_api.py
    data = fetch_traffic_incidents(bounding_box)
    return jsonify(data)

VALID_MODES = ["car", "truck", "bicycle", "pedestrian"]

def validate_vehicle_type(vehicle_type):
    """Validate the vehicle type parameter"""
    if not vehicle_type:
        return False, "Vehicle type parameter is missing"
    if vehicle_type not in VALID_MODES:
        return False, f"Invalid vehicle type. Must be one of: {VALID_MODES}"
    return True, None

@app.route('/route', methods=['GET'])
def route():
    """
    Handle API requests for route details.
    """
    # Get parameters from request arguments
    source = request.args.get('source')
    destination = request.args.get('destination')
    vehicle_type = request.args.get('vehicle_type')

    if not source or not destination:
        return jsonify({"error": "Missing 'source' or 'destination' parameter"}), 400

    # Validate vehicle type
    is_valid, error_message = validate_vehicle_type(vehicle_type)
    if not is_valid:
        return jsonify({"error": error_message}), 400

    # Fetch route details with vehicle type
    data = fetch_route(source, destination, vehicle_type)
    return jsonify(data)
@app.route('/air-quality', methods=['GET'])
def air_quality():
    """
    Handle API requests for air quality data.
    """
    # Get latitude and longitude from the request arguments
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Missing 'lat' or 'lon' parameter"}), 400

    try:
        # Validate coordinates as floats
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return jsonify({"error": "Invalid 'lat' or 'lon' value. Must be numbers."}), 400

    # Fetch air quality data using the function from meteorological_api.py
    data = fetch_nearest_air_quality(lat, lon)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
