from django.contrib import admin
from .models import Category, Color, Factory, Product, Size, Type

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'description')
    list_filter = ('category',)

admin.site.register(Product)
admin.site.register(Factory)
admin.site.register(Color)
admin.site.register(Size)



