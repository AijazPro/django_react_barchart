from django.db import models

class DataEntry(models.Model):
    year = models.IntegerField()
    month = models.IntegerField()
    date = models.DateField()
    value = models.IntegerField()

    def __str__(self):
        return f"{self.date}: {self.value}"
