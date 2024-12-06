import random
from django.core.management.base import BaseCommand
from faker import Faker
from app.models import Category, Type, Factory, Color, Size, Product
from django.utils.text import slugify

fake = Faker()

class Command(BaseCommand):
    help = 'Generate fake data for categories, types, factories, colors, sizes, and products.'

    def handle(self, *args, **kwargs):
        categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys']
        for category_name in categories:
            category, created = Category.objects.get_or_create(name=category_name, slug=slugify(category_name))
            if created:
                self.stdout.write(f"Category created: {category.name}")
            else:
                self.stdout.write(f"Category already exists: {category.name}")

        for category in Category.objects.all():
            for _ in range(3):  
                type_name = fake.word()
                slug = slugify(type_name)

                counter = 1
                original_slug = slug
                while Type.objects.filter(slug=slug).exists():
                    slug = f"{original_slug}-{counter}"
                    counter += 1

                type_instance, created = Type.objects.get_or_create(name=type_name, category=category, slug=slug)
                if created:
                    self.stdout.write(f"Type created: {type_instance.name}")
                else:
                    self.stdout.write(f"Type already exists: {type_instance.name}")

        factory_names = ['Jackson, Adams and Hawkins', 'Garcia, Garcia and Miller', 'Cline Group']
        for factory_name in factory_names:
            factory, created = Factory.objects.get_or_create(name=factory_name, slug=slugify(factory_name))
            if created:
                self.stdout.write(f"Factory created: {factory.name}")
            else:
                self.stdout.write(f"Factory already exists: {factory.name}")

        colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White']
        for color_name in colors:
            color_code = fake.hex_color()  
            color, created = Color.objects.get_or_create(name=color_name, color_code=color_code)
            if created:
                self.stdout.write(f"Color created: {color.name}")
            else:
                self.stdout.write(f"Color already exists: {color.name}")

        sizes = ['S', 'M', 'L', 'XL']
        for size_name in sizes:
            size, created = Size.objects.get_or_create(dimensions=size_name)
            if created:
                self.stdout.write(f"Size created: {size.dimensions}")
            else:
                self.stdout.write(f"Size already exists: {size.dimensions}")

        for _ in range(20):  
            name = fake.word()
            code = fake.unique.word()
            slug = slugify(f"{name}-{code}")  
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{slugify(f'{name}-{code}')}-{counter}"
                counter += 1

            product = Product.objects.create(
                name=name,
                price=fake.random_number(digits=3),
                discription=fake.text(),
                type=fake.random_element(Type.objects.all()),
                factory=fake.random_element(Factory.objects.all()),
                color=fake.random_element(Color.objects.all()),
                size=fake.random_element(Size.objects.all()),
                code=code,
                texture=fake.word(),
                slug=slug,  
                status=True
            )
            self.stdout.write(f"Product created: {product.name}")
