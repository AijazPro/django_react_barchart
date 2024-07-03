from django.core.management.base import BaseCommand
from dataapp.models import DataEntry
from datetime import datetime

class Command(BaseCommand):
    help = 'Add sample data to the database'

    def handle(self, *args, **kwargs):
        sample_data = [
            {"year": 2024, "month": 1, "date": "2024-01-01", "value": 300},
            {"year": 2024, "month": 1, "date": "2024-01-02", "value": 400},
            {"year": 2024, "month": 1, "date": "2024-01-03", "value": 550},
            {"year": 2024, "month": 2, "date": "2024-02-01", "value": 300},
            {"year": 2024, "month": 2, "date": "2024-02-02", "value": 400},
            {"year": 2024, "month": 2, "date": "2024-02-03", "value": 550},
        ]
        for entry in sample_data:
            DataEntry.objects.create(**entry)
        self.stdout.write(self.style.SUCCESS('Successfully added sample data'))
