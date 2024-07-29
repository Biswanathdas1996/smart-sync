import os
import csv
import json

# def export_to_csv(json_data, filename):
#     # Convert JSON string to Python object
#     data = json.loads(json_data)
    
#     # Ensure data is a list of dictionaries
#     if not isinstance(data, list):
#         raise ValueError("Input data must be a list")
#     if not all(isinstance(item, dict) for item in data):
#         raise ValueError("Each item in the list must be a dictionary")
    
#     # Define CSV fieldnames
#     fieldnames = [
#         "Customer Name",
#         "Document number",
#         "Document Date",
#         "Amount in Foreign Currency",
#         "Currency",
#         "Conversion rate",
#         "Amount in INR",
#         "Effective TDS Rate",
#         "TDS amount",
#         "Description of Invoice"
#     ]

#     # Write data to CSV
#     with open(filename, 'w', newline='') as csvfile:
#         writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
#         # Write headers
#         writer.writeheader()
        
#         # Write data rows
#         for item in data:
#             writer.writerow(item)


def extract_keys(data):
    if not data:
        return []

    keys = list(data[0].keys())
    return keys


def export_to_csv(data, filename, template):

    result = extract_keys(template)

    with open(filename, 'w', newline='') as csvfile:
        
        writer = csv.DictWriter(csvfile, fieldnames=result)
        writer.writeheader()
        
        for item in data:
            json_data = json.loads(item)
            writer.writerow(json_data[0])







    

