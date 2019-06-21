import requests
# If you are using a Jupyter notebook, uncomment the following line.
#%matplotlib inline
# import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
import os
import sys
import urllib.request
import json
import ast

with open('vvvp/metadata/keys.json') as f:
    js = f.read()
    keys=ast.literal_eval(js)

def vision_im2txt(img):
    api_key = keys['vision_api']
    assert api_key
    vision_base_url = "https://koreacentral.api.cognitive.microsoft.com/vision/v1.0/analyze"
    image_data = img
    #image_path = 'c:/surround_system_pro/vvvp/alone.jpg'
    #image_data = open(image_path, "rb").read()
    params  = {'visualFeatures': 'Categories,Description,Color'}
    headers = {'Ocp-Apim-Subscription-Key': api_key,'Content-Type': 'application/octet-stream'}
    response = requests.post(vision_base_url, headers=headers,params=params, data=image_data)
    # response.raise_for_status()

    response.text
    res = json.loads(response.text)
    # print(str(res) + '------------------------' , flush=True)

    result = res['description']['captions'][0]['text']
    return result

def translate(result):

    client_id = keys['papago_api'][0]['id']
    client_secret = keys['papago_api'][0]['secret']

    encText = urllib.parse.quote(result)
    data = "source=en&target=ko&text=" + encText
    url = "https://openapi.naver.com/v1/papago/n2mt"
    request = urllib.request.Request(url)

    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))

    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        response_json = json.loads(response_body.decode('utf-8'))
        print(response_json['message']['result']['translatedText'])
        text = response_json['message']['result']['translatedText']
        return text
    else:
        print("Error Code:" + rescode)
