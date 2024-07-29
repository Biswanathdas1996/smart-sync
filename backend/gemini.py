# from flask import Flask, request, jsonify
# import google.generativeai as genai
# app = Flask(__name__)
# GEMINI_API_KEY = ""
# model1 = genai.GenerativeModel('gemini-pro')
# genai.configure(api_key=GEMINI_API_KEY)
# @app.route('/ask', methods=['POST'])
# def ask_question():
#     data = request.json
#     question = data['question']
#     response = model_function(question)
#     return jsonify({'response': response})
# def model_function(question):
#     response = model1.generate_content(f"Answer the question:{question}", generation_config={
#         "max_output_tokens": 2048,
#         "temperature": 0.8,
#         "top_p": 1
#     })
#     return response.text
# if __name__ == '__main__':
#     app.run(debug=True)
#     ----------------------------


from FileReader import process_files
import os
import PIL.Image
import google.generativeai as genai
import csv
import json
from export_to_csv import export_to_csv
import datetime

GEMINI_API_KEY = "AIzaSyDt1jEVC44Ku36trts12J3JpiasYozzKJE"
model = genai.GenerativeModel('gemini-1.5-flash')
genai.configure(api_key=GEMINI_API_KEY)



def export_to_json(title, responses):
    output_dir = f"scenario/{title}/output/progress/"
    os.makedirs(output_dir, exist_ok=True)  # create directory if it doesn't exist
    # Get current date and time
    now = datetime.datetime.now()

    # Format as a string
    timestamp = now.strftime("%Y%m%d_%H%M%S")

    # Create filename with timestamp
    filename = f'responses_{timestamp}.json'

    json_string = responses.strip()
    data = json.loads(json_string)

    with open(os.path.join(output_dir, filename), 'w') as f:
        json.dump(data, f)



async def generate_response(image_path,template, title):


    data = [{"key": "value"}]
    data_string = json.dumps(data)


    XML_address_format = """
        <PstlAdr>
            <AdrLine>90B, Sector 18, Delhi-Jaipur Expy</AdrLine>
            <AdrLine>Gurugram - 122001</AdrLine>
            <AdrLine>Delhi, Jaipur Expy</AdrLine>
            <AdrLine>Gurugram - 122001</AdrLine>
            <PstCd>122001</PstCd>
            <TwnNm>Gurugram</TwnNm>
            <Ctry>IN</Ctry>
        </PstlAdr>
        """

    input_text = f'''
        Extract and fill up the "---" of the given Template with proper data from the photo and output then in JSON like {data_string} :


        Template : {template}

        
        
        Instruction
            1) output only raw and valid JSON in string.
            2) Do not include any personal identifiable information in the output.
            3) Do not include any other text in the output except JSON.
            4) Do not give output with ```json in the start
            5) Do not put SMARTPADDLE TECHNOLOGY PRIVATE LIMITED or Bizongo as Supplier name.
            6) Any date format would be DD/MM/YYYY
            7) All the amount value would be numaric
            8) XML address format must be follow {XML_address_format} this format and tag

        
    '''
    print("template=======>",input_text)


    img = PIL.Image.open(image_path)
    v_response = model.generate_content([input_text, img], stream=False)
    
    v_response.resolve()  
    print(v_response)
    
    os.remove(image_path)

    export_to_json(title, v_response.text)
    
    # export_to_csv(v_response.text, "output.csv")
    return v_response

def is_valid_json(my_json):
    try:
        json.loads(my_json)
        return True
    except json.JSONDecodeError:
        return False

async def process_images(folder_path, template, title):
    responses = []
    if not os.path.exists(folder_path):
        print("Folder does not exist.")
        return responses
    
    if not os.path.isdir(folder_path):
        print("Path is not a directory.")
        return responses
    
    
    image_files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    
    image_files = [f for f in image_files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
    
    if not image_files:
        print("No image files found in the folder.")
        return responses
    
    for image_file in image_files:
        image_path = os.path.join(folder_path, image_file)
        response = await generate_response(image_path, template, title)
        
        if(is_valid_json(response.text)):
            responses.append(response.text)

    print("1================>", responses)
    return responses


    

