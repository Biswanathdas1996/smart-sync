

from flask import Flask, request, jsonify
import os
import PIL.Image
import google.generativeai as genai
import csv
import json
from upload_pdf import upload_files
from gemini import process_images
from pdf_to_img import pdf_to_images
import asyncio
from export_to_csv import export_to_csv
from flask_cors import CORS
import datetime
import pandas as pd
from werkzeug.utils import secure_filename
from InvoicePreBuild import processWithInvoicePreBuild

app = Flask(__name__)
CORS(app)

def process_data(data):
    try:
        json_data = json.loads(data)
        # Process the data here
        # ...
        return True
    except ValueError as e:
        print(f"Invalid JSON: {e}")
        return False

# def combine_json_files(directory):
#     combined_data = []

#     for filename in os.listdir(directory):
#         if filename.endswith(".json"):
#             with open(os.path.join(directory, filename), 'r') as f:
#                 data = f.read()

#                 if process_data(data):
#                     print("Data processed successfully.")
#                     combined_data.append(json.loads(data))
#                     # combined_data.push(json.loads())

#     return combined_data

def combine_json_files(folder_path):
    combined_data = []
    
    # Iterate over each file in the directory
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r') as file:
                data = json.load(file)
                # Extend the combined_data list with the data from the current file
                combined_data.extend(data)
    
    return combined_data



def empty_folder(folder_path):
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                os.rmdir(file_path)
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {e}")

def get_folder_contents(folder_path):
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    subfolders = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]
    for i, subfolder in enumerate(subfolders):
        subfolder_path = os.path.join(folder_path, subfolder)
        subfolders[i] = {subfolder: get_folder_contents(subfolder_path)}
    return {'files': files, 'subfolders': subfolders}

def create_folders(title):
    # Create a new folder with the title
    os.makedirs(f"scenario/{title}", exist_ok=True)
    os.makedirs(f"scenario/{title}/template", exist_ok=True)
    os.makedirs(f"scenario/{title}/input", exist_ok=True)
    os.makedirs(f"scenario/{title}/processed", exist_ok=True)
    os.makedirs(f"scenario/{title}/output", exist_ok=True)
    os.makedirs(f"scenario/{title}/output/progress", exist_ok=True)
    os.makedirs(f"scenario/{title}/process", exist_ok=True)


@app.route('/create-folder', methods=['POST'])
def create_folder():
    title = request.form['title']
    create_folders(title)
    return jsonify({'status': 'Folder created successfully'})



@app.route('/process-template', methods=['POST'])
def upload_csv():
    # if 'file' not in request.files:
    #     return jsonify({'error': 'No file part'})
    # file = request.files['file']
    # title = request.form['title']
    # # Create a new folder with the title
    # create_folders(title)  
    # # upload the tmplate into it
    # filename = secure_filename(file.filename)
    # filepath = os.path.join("/", 'input_csv_file.csv')
    # file.save(filepath)
    df = pd.read_csv('input_csv_file.csv')
    headers = df.columns.tolist()
    formatted_headers = [{header: "---"} for header in headers]
    merged_data = dict()
    for d in formatted_headers:
        merged_data.update(d)
    merged_data = [merged_data]
    return jsonify(merged_data)

@app.route('/upload', methods=['POST'])
def upload():
    # empty_folder(app.config['UPLOAD_FOLDER'])
    # empty_folder('output_images')
    title = request.form['title']

    if 'files[]' not in request.files:
        return jsonify({'error': 'No file part'})
    files = request.files.getlist('files[]') 
    path  = f"scenario/{title}/input"
    upload_files(files,path)

    return jsonify({'status': "File uploaded successfully" })



@app.route('/prepare-data', methods=['POST'])
def prepare():
    title = request.form['title']
    input_folder = f"scenario/{title}/input"
    output_folder = f"scenario/{title}/process"
    pdf_to_images(input_folder,output_folder)   
    return jsonify({'status': "File processed successfully" })

@app.route('/generate-response', methods=['POST'])
async def generate():
    current_datetime = datetime.datetime.now()
    print("Current Date and Time:", current_datetime)
    data = request.json
    template = data['template']
    json_string = json.dumps(template, indent=4)
    title = data['title']
    output_images_folder = f"scenario/{title}/process"  # Provide the path to your folder containing images
    responses = await process_images(output_images_folder, json_string, title)
    print("====================>",responses)
    output_dir = f"scenario/{title}/output/"
    os.makedirs(output_dir, exist_ok=True)  # create directory if it doesn't exist
    with open(os.path.join(output_dir, 'responses.json'), 'w') as f:
        json.dump(responses, f)
    export_to_csv(responses, f"scenario/{title}/output/output.csv", template)
    return jsonify({'response': responses})


@app.route('/generate-response-with-azure-invoice-ai', methods=['POST'])
async def generate_with_azure_invoice_ai():
    data = request.json
    title = data['title']
    input_folder = f"scenario/{title}/process"  
    output_folder = f"scenario/{title}/output/progress"  
    processWithInvoicePreBuild(input_folder, output_folder) 
    return jsonify({'response': "done"})

@app.route('/get-all-scenario', methods=['GET'])
def get_folders():
    base_folder = 'scenario'
    folders = [f for f in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, f))]
    folder_contents = {}
    for folder in folders:
        folder_path = os.path.join(base_folder, folder)
        folder_contents[folder] = get_folder_contents(folder_path)
    return jsonify(folder_contents)

@app.route('/delete-file', methods=['DELETE'])
def delete_file():
    folder = request.args.get('folder')
    file = request.args.get('file')
    file_path = f'scenario/{folder}/{file}'
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({'status': 'File deleted'})
    else:
        return jsonify({'status': 'File not found '}), 404

@app.route('/get-output-data', methods=['POST'])
def get_output_data():
    title = request.form['title']
    output_dir = f"scenario/{title}/output/"
    with open(os.path.join(output_dir, 'output.csv'), 'r') as f:
        reader = csv.DictReader(f)
        data = [row for row in reader]
    return jsonify(data)

@app.route('/get-process-data', methods=['POST'])
def get_process_data():
    title = request.form['title']
    process_dir = f"scenario/{title}/process/"
    files = [f for f in os.listdir(process_dir) if os.path.isfile(os.path.join(process_dir, f))]
    print(files)
    return jsonify(files)

@app.route('/get-progress', methods=['POST'])
def get_combined_data():
    title = request.form['title']
    progress_dir = f"scenario/{title}/output/progress/"
    combined_data = combine_json_files(progress_dir)
    print("====combined_data==>",combined_data)
    return jsonify(combined_data)

if __name__ == '__main__':
    app.run(debug=True)




