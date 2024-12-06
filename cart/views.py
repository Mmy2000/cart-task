from decimal import Decimal
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from app.models import Product
from .cart import Cart


def cart_view(request):
    cart = Cart(request)
    total_quantity = 0
    grand_total = Decimal("0.00")
    products = []
    cart_items = cart.get_items()

    for item in cart_items:
        total_price = Decimal(item["price"]) * item["quantity"]
        products.append({
            "id": item["product"].id,
            "product": {
                "name": item["product"].name,
                "price": f"{Decimal(item['price']):.2f}",
            },
            "quantity": item["quantity"],
            "total_price": f"{total_price:.2f}",
        })
        total_quantity += item["quantity"]
        grand_total += total_price

    return render(request, "cart/cart.html", {
        "products": products,
        "total_quantity": total_quantity,
        "grand_total": f"{grand_total:.2f}",
    })


def add_to_cart(request, product_id):
    if not request.session.session_key:
        request.session.create()

    product = get_object_or_404(Product, id=product_id)
    cart = Cart(request)
    quantity = int(request.GET.get("quantity", 1))
    cart.add(product=product, quantity=quantity)

    total_quantity = len(cart.get_items())
    request.session["cart_total_quantity"] = total_quantity
    print(request.session["cart_total_quantity"])

    return JsonResponse({
        "message": "Product added to cart successfully!",
        "total_quantity": total_quantity,
    })


def remove_from_cart(request, product_id):
    cart = Cart(request)
    try:
        cart.remove(product_id)
        total_quantity = sum(item["quantity"] for item in cart.get_items())
        grand_total = sum(Decimal(item["price"]) * item["quantity"] for item in cart.get_items())

        request.session["cart_total_quantity"] = total_quantity

        return JsonResponse({
            "message": "Product removed from cart",
            "total_quantity": total_quantity,
            "grand_total": f"{grand_total:.2f}",
        })
    except KeyError:
        return JsonResponse({"error": "Product not found in cart"}, status=404)


def clear_cart(request):
    cart = Cart(request)
    cart.cart.clear()
    cart.save()

    request.session["cart_total_quantity"] = 0

    return JsonResponse({
        "message": "Cart cleared successfully",
        "total_quantity": 0,
        "grand_total": "0.00",
    })
