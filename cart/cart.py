from .models import Product

class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart', {})
        if not cart:
            cart = self.session['cart'] = {} 
        self.cart = cart

    def add(self, product, quantity=1):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {'quantity': 0, 'price': str(product.price)}
        self.cart[product_id]['quantity'] += quantity
        self.save()

    def save(self):
        self.session['cart'] = self.cart
        self.session.modified = True

    def get_items(self):
        items = []
        for product_id, data in self.cart.items():
            product = Product.objects.get(id=product_id)
            items.append({
                'product': product,
                'quantity': data['quantity'],
                'price': data['price'],
            })
        return items

    def remove(self, product_id):
        product_id = str(product_id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()
        else:
            raise KeyError(f"Product with id {product_id} not found in cart.")

def cart_total_quantity(request):
    return {
        "cart_total_quantity": request.session.get("cart_total_quantity", 0)
    }

def unique_product_count(self):
        # Returns the number of unique products in the cart
        return len(self.cart)
