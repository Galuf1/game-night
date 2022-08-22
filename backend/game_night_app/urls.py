from django.urls import path
from . import views

urlpatterns = [
    path('', views.send_the_homepage),
    path('/grouprequest/create', views.create_group_request),
    path('/grouprequest/view', views.view_group_request),
]
