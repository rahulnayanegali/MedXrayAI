#Resources:
#https://www.youtube.com/watch?v=7LNl2JlZKHA (tutorial to set up simple API in React using Flask)
#https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/ (Tutorial to install Python environment in Windows)
#https://www.geeksforgeeks.org/how-to-install-flask-in-windows/ (tutorial to install Flask in Windows)
#Before running React app, test API at localhost:5000/members. 
#How to run this server:
# run "cd .ven\" AND "Scripts\activate" (Windows) or "source ven/bin/activate" (Mac)
# run "pip install flask" (Windows) or "pip3 install flask" (Mac)
# run "python server.py" (Windows) or "python3 server.py" (Mac)
#
#to stop server, run "deactivate"
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from tensorflow.keras.models import load_model
import os
from chexpert_prediction import get_finding
import tempfile

app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://medxrayai.vercel.app"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Load the model at startup
model = load_model('optimized_model.h5')

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight request
    if request.method == 'OPTIONS':
        return '', 204

    try:
        # Get image URL from request body
        data = request.get_json()
        image_url = data.get('image_url')

        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400

        # Download image
        print("Image URL:", image_url)
        response = requests.get(image_url, stream=True)

        # Check if image download is successful
        if response.status_code == 200:
            # Get content type from response header
            content_type = response.headers.get('Content-Type')

            # Check content type and determine file extension
            if content_type == "image/jpeg":
                file_extension = "jpeg"
            elif content_type == "image/jpg":
                file_extension = "jpg"
            elif content_type == "image/png":
                file_extension = "png"
            elif content_type == "image/dicom":
                file_extension = "dicom"
            else:
                raise ValueError(f"Unsupported image format: {content_type}")

            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
                for chunk in response.iter_content(1024):
                    temp_file.write(chunk)
                temp_path = temp_file.name

            print("Image downloaded successfully!")
        else:
            print("Failed to download image. Status code:", response.status_code)
            return jsonify({'error': 'Failed to download image'}), 500

        # Call prediction function with temporary file
        result = get_finding(model, temp_path)
        print(result)

        # Clean up temporary file
        os.unlink(temp_path)

        # Return prediction result
        return jsonify({
            'prediction': {
                'name': result['top_diagnosis'],
                'description': result['predictions'][result['top_diagnosis']]['description']
            },
            'predictions': result['predictions']
        }), 200

    except Exception as e:
        print("An error occurred:", str(e))
        return jsonify({'error': str(e)}), 500

#Members API Route
@app.route("/members")

def members():
    return {"members": ["Member1", "Member2", "Member3"]} #dictionary (key-value pair) with array as value

# This is required for Vercel
app = app

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
