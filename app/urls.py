from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("category/<str:slug>/", views.category, name="category"),
    path("product/<str:slug>/", views.product, name="product_detail"),
    # path("testBase/", views.testBase, name="testBase"),
    # path("testTemp/", views.testTemp, name="testTemp"),
    path('filter-by-color/', views.filter_by_color, name='filter_by_color'),

]