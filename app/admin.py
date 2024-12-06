from django.contrib import admin
from .models import Category, Color, Factory, Product, Size, Type


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'status', 'created_at')  # Display key fields
    list_filter = ('status', 'created_at')  # Add filters for status and creation date
    search_fields = ('name', 'description')  # Add search functionality
    prepopulated_fields = {"slug": ("name",)}  # Auto-generate slug from name
    ordering = ('-created_at',)  # Order by creation date descending


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'description', 'status', 'created_at')
    list_filter = ('category', 'status', 'created_at')
    search_fields = ('name', 'description', 'category__name')
    prepopulated_fields = {"slug": ("name",)}
    ordering = ('-created_at',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'type', 'factory', 'price', 'color', 'size', 'status', 'created_at')
    list_filter = ('type', 'factory', 'color', 'size', 'status', 'created_at')
    search_fields = ('name', 'code', 'type__name', 'factory__name', 'color__name')
    readonly_fields = ('slug', 'created_at')  # Make slug and creation date read-only
    prepopulated_fields = {"slug": ("name", "code")}
    ordering = ('-created_at',)
    list_editable = ('status', 'price')  # Allow inline editing of status and price


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ('-created_at',)


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('name', 'color_code')
    search_fields = ('name', 'color_code')
    ordering = ('name',)


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ('dimensions',)
    search_fields = ('dimensions',)
    ordering = ('dimensions',)


# Customize the admin site header and titles
admin.site.site_header = "Product Management Admin"
admin.site.site_title = "Product Management Portal"
admin.site.index_title = "Welcome to the Product Management Dashboard"
