import os
import fitz
from PIL import Image

def pdf_to_images(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(input_folder, filename)
            pdf_document = fitz.open(pdf_path)
            
            # Render all pages
            images = []
            for i in range(len(pdf_document)):
                page = pdf_document.load_page(i)
                pix = page.get_pixmap()
                image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                images.append(image)

            # Combine all pages into a single image
            combined_image = Image.new('RGB', (max(img.width for img in images), sum(img.height for img in images)))
            y_offset = 0
            for img in images:
                combined_image.paste(img, (0, y_offset))
                y_offset += img.height

            # Save the combined image
            image_path = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}.png")
            combined_image.save(image_path)

            pdf_document.close()