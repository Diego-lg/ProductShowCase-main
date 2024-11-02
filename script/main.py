from flask import Flask, send_file, jsonify, request 
import json, requests, io, base64, os, re
from PIL import Image, PngImagePlugin
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Ensure the creations directory exists
if not os.path.exists('creations'):
    os.makedirs('creations')

def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

def backgroundRemover(base_64_img):
    print("Removing Background...")
    url = "http://127.0.0.1:7860"
    images = []
    payload = {
        "input_image": base_64_img,
        "model": "isnet-anime",
        "return_mask": "false",
        "alpha_matting": "false",
        "alpha_matting_foreground_threshold": 240,
        "alpha_matting_background_threshold": 10,
        "alpha_matting_erode_size": 10
    }

    response = requests.post(url=f'{url}/rembg', json=payload)
    response.raise_for_status()

    r = response.json()
    print("Response status:", response.status_code)
    print(r["image"])
    encoded_string = r["image"]
    output_filename = "creations/output.png"
    try:
        # Decode the base64 string
        decoded_data = base64.b64decode(encoded_string)

        # Write the decoded data to a PNG file
        with open(output_filename, 'wb') as f:
            f.write(decoded_data)

        print(f"Decoded data successfully written to {output_filename}")
    except Exception as e:
        print("An error occurred:", e)

    return 0;

def generate_images():
    data = request.json  # Get JSON data from the POST request
    input_value = data.get('input')  # Extract the input value
    print("PROMPT: "+input_value)
    print("Generating images...")
    url = "http://127.0.0.1:7860"
    images = []
    payload = {
        "prompt": input_value +"(vector art style), detailed, 8k uhd, high quality,masterpiece, best quality ",
        "negative_prompt": "NSFW",
        "steps": 15,
        "width": 1280,
        "height": 720,
        "sampler_name": "DDIM",
        "cfg_scale": 7
    }
    option_payload = {
        "sd_model_checkpoint": "dreamshaper_5BakedVae.safetensors"
    }

    payload.update(option_payload)
    response = requests.post(url=f'{url}/sdapi/v1/options', json=option_payload)
    response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)

    r = response.json()
    if 'images' in r:
        for i in r['images']:
            image = Image.open(io.BytesIO(base64.b64decode(i.split(",", 1)[0])))

            png_payload = {
                "image": "data:image/png;base64," + i
            }
            response2 = requests.post(url=f'{url}/sdapi/v1/png-info', json=png_payload)
            pnginfo = PngImagePlugin.PngInfo()
            pnginfo.add_text("parameters", response2.json().get("info"))
            image.save('creations/output.png', pnginfo=pnginfo)
            images.append(image)  # Append the processed image to the images list
    else:
        print("'images' key not found in the dictionary.")
        print(r)
    print("Images generated.")
    print(response.json().get("info"))
    return 0;

@app.route('/generate', methods=['POST'])
def imgProcess():
    generate_images()  # Move this line inside the route

    image_path = 'creations/output.png'
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
    img_io = io.BytesIO(image_data)
    print(image_path)

    return send_file(image_path)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
