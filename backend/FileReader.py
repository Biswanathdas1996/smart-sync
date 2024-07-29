import os
import json
import aiohttp
import asyncio
from aiohttp import FormData
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages




 


def generate_table_json(allData):
    # print(allData)
    data = allData['data']['tabular_data']
    key_value = allData['data']['key_value']
    text_data = allData['data']['text_data']
    generated_tables = {}
    for index, table_data in enumerate(data):
        table = {'header': [], 'data': []}
        
        for key, value in table_data.items():
            row, col = value[0]
            cell_value = value[1]
            
            while len(table['data']) <= row:
                table['data'].append([])
            while len(table['header']) <= col:
                table['header'].append(None)
            
            if len(table['data'][row]) <= col:
                table['data'][row].extend([None] * (col - len(table['data'][row]) + 1))
            
            if table['header'][col] is None:
                table['header'][col] = cell_value
            else:
                table['data'][row][col] = cell_value
        
        generated_tables[f"table{index + 1}"] = table
    response = { 'tables': generated_tables , 'key_values': key_value, 'unstructured_data': text_data}
    final_response = json.dumps(response, indent=4)

    return final_response


def save_json_formated_response(allData, fileName):
    final_response = generate_table_json(allData)
    with open(fileName, 'w') as file:
        file.write(final_response)

 
def xlsx_to_json(xlsx_file, json_file):
    # Read the Excel file into a pandas DataFrame
    df = pd.read_excel(xlsx_file)

    # Convert DataFrame to JSON and write to a JSON file
    df.to_json(json_file, orient='records')

# # Example usage
# xlsx_file = 'input.xlsx'
# json_file = 'output.json'

# xlsx_to_json(excel_file, json_file)


async def send_file(session, url, file_path):

    data = FormData()
    data.add_field('file',
                   open(file_path, 'rb'),
                   filename=os.path.basename(file_path),
                   content_type='application/pdf')

    headers = {
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-platform': '"Windows"',
        'Referer': 'https://checkmate-ai.azurewebsites.net/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    async with session.post(url, data=data, headers=headers) as response:
        
        return await response.json() # Parse the response text into a JSON object

async def process_files(input_dir,output_dir, url):
   
    async with aiohttp.ClientSession() as session:
        tasks = []
        for file_name in os.listdir(input_dir):
            if file_name.endswith('.pdf'):
                file_path = os.path.join(input_dir, file_name)

                json_raw_extracted_data = await send_file(session, url, file_path)

                tasks.append((file_name, json_raw_extracted_data))

                if json_raw_extracted_data:
                    output_file = os.path.join(output_dir, f"{os.path.splitext(file_name)[0]}.json") 
                    save_json_formated_response(json_raw_extracted_data, output_file)

            elif file_name.endswith('.xlsx'):
                xlsx_file = os.path.join(input_dir, file_name)
                json_file = os.path.join(output_dir, file_name.replace('.xlsx', '.json'))
                xlsx_to_json(xlsx_file, json_file)
            
        # responses = await asyncio.gather(*[task for _, task in tasks])

        # for (file_name, _), response in zip(tasks, responses):
        #     output_file = os.path.join(output_dir, f"{os.path.splitext(file_name)[0]}.json")
        #     with open(output_file, 'w') as f:
        #         json.dump(response, f, indent=4)  

# Usage


# asyncio.run(process_files("scenario/klklklkl/input", "scenario/klklklkl/file_reader_output", "https://table-extracter-backend.azurewebsites.net/analyze"))