from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django.db.models import Avg

    
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    slug = models.SlugField(unique=True, blank=True)

    is_active = models.BooleanField(default=False)

    price=models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while True:
                try:
                    Hotel.objects.get(slug=slug)
                    # Slug already exists, append a counter to make it unique
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                except Hotel.DoesNotExist:
                    # Unique slug found, exit the loop
                    break

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class HotelReview(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.TextField()
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.place.name}"
    
class HotelImage(models.Model):
    place = models.ForeignKey(Hotel, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='hotel_images/', null=True)

    def __str__(self):
        return f"Image for {self.hotel.name}"
    
# class KhaltiValidation(models.Model):
#     amount=models.IntegerField(default=0)
#     token= models.CharField(max_length=255)
#     def __str__(self):
#         return self.token

from django.utils import timezone

class KhaltiValidation(models.Model):
    amount = models.IntegerField(default=0)
    token = models.CharField(max_length=255)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.token

    def save(self, *args, **kwargs):
        # Calculate the expiration date (30 days from the subscribed_at)
        expiration_date = self.subscribed_at + timezone.timedelta(days=30)

        # Update the is_active attribute based on the current date
        if timezone.now() > expiration_date:
            self.is_active = False

        super().save(*args, **kwargs)
    