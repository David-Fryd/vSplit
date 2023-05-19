import json

def compute_centroid(coordinates):
    min_x = min_y = float('inf')
    max_x = max_y = float('-inf')

    for coord in coordinates:
        min_x = min(min_x, coord[0])
        max_x = max(max_x, coord[0])
        min_y = min(min_y, coord[1])
        max_y = max(max_y, coord[1])

    return [(min_x + max_x) / 2, (min_y + max_y) / 2]

def parse_ownership(properties):
    ownership = {}
    for key, value in properties.items():
        ranges = value.split("-")
        ownership[key] = [(int(ranges[0]), int(ranges[1]))]
    return ownership

# Load the original data
with open('data.geojson') as f:
    data = json.load(f)

# Transform the data
new_data = {'fir': {}, 'sectors': {}, 'volumes': []}
ownership_keys = set()
for feature in data['features']:
    # Compute the centroid of the bounding box for the feature
    labelLocation = compute_centroid(feature['geometry']['coordinates'][0])

    # Parse the 'properties' object into the 'ownership' format
    ownership = parse_ownership(feature['properties'])
    
    # collect all the ownership keys
    ownership_keys.update(ownership.keys())

    # After parsing ownership, features stripped of redundant info
    del feature['properties']

    # Create the new object
    new_object = {
        'labelLocation': labelLocation,
        'ownership': ownership,
        'geojson': feature
    }

    # Append the new object to the new data
    new_data['volumes'].append(new_object)

# Mapping ownership keys to labels and sort the keys
ownership_with_labels = {key: f"SECTOR_{key}_LABEL" for key in sorted(ownership_keys)}

# Add the list of ownership keys and their labels to the new data
new_data['sectors'] = ownership_with_labels

new_data['fir'] = {'firName': 'FIR_NAME (e.g: ZMA)', 'firLabel': 'FIR_LABEL (e.g: Miami ARTCC)'}

# Save the transformed data
with open('new_data.json', 'w') as f:
    json.dump(new_data, f, indent=2)