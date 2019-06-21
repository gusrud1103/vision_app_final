# -*- coding: utf-8 -*-
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
# from rest_framework.renderers import JSONRenderer
# from rest_framework.parsers import JSONParser
from vvvp.analyze_image import vision_im2txt, translate
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
import json
import sys
import ast
#
#
class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


@csrf_exempt
def get_img(request):
    if request.method == 'POST':
        img = request.body
        img_describe = get_text(img)
        result = JSONResponse(img_describe, status=200)
        print(result,flush=True)
        return result
        # return json.dumps(img_describe)



def get_text(img):
    text = translate(vision_im2txt(img))
    data = [
        {'text': text}
    ]
    return json.dumps(data,ensure_ascii=False)
