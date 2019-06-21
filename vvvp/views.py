# -*- coding: utf-8 -*-
from django.shortcuts import render


def index(request):
    return render(request, 'vvvp/index.html', {})

def main(request):
    return render(request, 'vvvp/main.html', {})
