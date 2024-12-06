from django.shortcuts import render
from .models import Color, Factory, Product, Category, Type
from django.http import JsonResponse



def index(request):
    categoties = Category.objects.all()
    products = Product.objects.all()
    context = {
        'products': products,
        'categories': categoties
        
    }
    return render(request, 'app/index.html', context)


def category(request, slug):
    
    print(slug)
    categories = Category.objects.all()
    category = categories.get(slug=slug)    
    types = Type.objects.filter(category=category)
    products = Product.objects.filter(type__in=types)
    colors = Color.objects.all()
    factorys = Factory.objects.all()

    context = {
        'categories': categories,
        'category': category,
        'subcategories': types,
        'products': products,
        'colors': colors,\
        'factorys': factorys
    }
    return render(request, 'app/category.html', context)


def product(request, slug):
    product = Product.objects.get(slug=slug)
    context = {
        'product': product
    }
    return render(request, 'app/productpage.html', context)



from .models import Product

def filter_by_color(request):
    if request.method == 'GET':
        color_code = request.GET.get('color_code', None)
        if color_code:
            products = Product.objects.filter(color_code=color_code)
            product_data = [{'name': product.name, 'price': product.price, 'image': product.image.url} for product in products]
            return JsonResponse({'products': product_data})
        else:
            return JsonResponse({'error': 'No color code provided'}, status=400)