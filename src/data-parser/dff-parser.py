import json
import os

# Load data from output.json, which is in the same directory as this script
current_directory = os.path.dirname(os.path.abspath(__file__))
output_json_path = os.path.join(current_directory, "output.json")

# Load data from output.json
with open(output_json_path, "r") as json_file:
    data = json.load(json_file)

# Directory where .dff and .txd files are stored (relative to the script's location)
files_directory = os.path.join(current_directory, "gtasa-skins")

# Get the list of model names from output.json
model_names = {entry["Model"] for entry in data}

# List of all files in the directory
all_files_in_directory = os.listdir(files_directory)

# Filter out files to delete
files_to_delete = [
    f for f in all_files_in_directory
    if not (f.endswith(('.dff', '.txd')) and os.path.splitext(f)[0] in model_names)
]

# Delete files that do not match the criteria
for file_name in files_to_delete:
    file_path = os.path.join(files_directory, file_name)
    os.remove(file_path)
    print(f"Deleted {file_path}")

# Filter the data to include only entries with matching .dff or .txd files
filtered_data = [
    entry for entry in data
    if entry["Model"] in model_names
]

# Save the filtered data to a new JSON file in the same directory as the script
filtered_output_path = os.path.join(current_directory, "filtered_output.json")
with open(filtered_output_path, "w") as output_file:
    json.dump(filtered_data, output_file, indent=4)

print("Filtered data has been written to filtered_output.json")
