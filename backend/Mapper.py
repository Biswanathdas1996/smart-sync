import os
import json


dictionary = {
    
}


template  = [
    {
        "CGST": "---",
        "Consignee (Ship to) Name": "---",
        "Consignee address ": "---",
        "Date of Invoice": "---",
        "GST amount": "---",
        "GSTIN": "---",
        "IGST": "---",
        "Invoice No.": "---",
        "Item HSN code": "---",
        "PO reference number ": "---",
        "SGST": "---",
        "Supplier State/ Address": "---",
        "Supplier name": "---",
        "Total amount": "---"
    }
]

def get_json_from_folder(folder_path):

    json_files = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.json'):
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, 'r') as file:
                json_data = json.load(file)
                print(json_data['key_values'])
                json_files.append(json_data)

    # print(json_files)

# folder_path = 'scenario/klklklkl/file_reader_output'
# get_json_from_folder(folder_path)
