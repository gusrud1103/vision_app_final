from django.urls import path
from django.conf.urls import include, url
from . import views
from vvvp import im2txt_views

urlpatterns = [
    path('index', views.index, name='index'),
    path('main', views.main, name='main'),
    url(r'^get_img/?$', im2txt_views.get_img, name='get_img'),
]
