import requests
# If you are using a Jupyter notebook, uncomment the following line.
#%matplotlib inline
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
# api_vision
api_key = api_vision
assert api_key
vision_base_url = "https://koreacentral.api.cognitive.microsoft.com/vision/v1.0/analyze"

image_path = 'alone.jpg'
image_data = open(image_path, "rb").read()
params  = {'visualFeatures': 'Categories,Description,Color'}
headers = {'Ocp-Apim-Subscription-Key': api_key,'Content-Type': 'application/octet-stream'}
response = requests.post(vision_base_url, headers=headers,params=params, data=image_data)
# response.raise_for_status()

response.text
import json
res = json.loads(response.text)
result = res['description']['captions'][0]['text']
print(result)
