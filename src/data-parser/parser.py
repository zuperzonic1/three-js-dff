import os
import json

# Define the directory containing the TXD and DFF files
skins_directory = os.path.join("src", "data-parser", "gtasa-skins")  # Relative path to skins folder
output_json_file = os.path.join("src", "data-parser", "output.json")  # Relative path to JSON file
filtered_output_file = os.path.join("src", "data-parser", "filteredOutput.json")  # Output file path

def get_skin_files(directory):
    """
    Get a list of files in the skins directory.
    """
    if not os.path.exists(directory):
        print(f"Error: Directory {directory} does not exist.")
        return set(), set()

    files = os.listdir(directory)
    txd_files = {file.replace('.txd', '') for file in files if file.endswith('.txd')}
    dff_files = {file.replace('.dff', '') for file in files if file.endswith('.dff')}
    return txd_files, dff_files

def filter_models(data, txd_files, dff_files):
    """
    Filter models to remove entries with missing TXD or DFF files.
    """
    filtered_data = []

    for entry in data:
        model = entry["Model"]
        if model in txd_files and model in dff_files:
            filtered_data.append(entry)

    return filtered_data

def main():
    # Check if the JSON file exists
    if not os.path.exists(output_json_file):
        print(f"Error: File {output_json_file} does not exist.")
        return

    # Load the output.json file
    try:
        with open(output_json_file, "r") as file:
            data = json.load(file)
    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse JSON file: {e}")
        return

    # Extract model names from JSON
    models = {entry["Model"] for entry in data}

    # Get TXD and DFF files from the directory
    txd_files, dff_files = get_skin_files(skins_directory)

    # Filter models to exclude missing TXD or DFF files
    filtered_data = filter_models(data, txd_files, dff_files)

    # Write the filtered data to a new JSON file
    with open(filtered_output_file, "w") as file:
        json.dump(filtered_data, file, indent=4)

    print(f"Filtered output written to {filtered_output_file}")

if __name__ == "__main__":
    main()
