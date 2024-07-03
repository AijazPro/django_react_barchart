from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DataEntry
from django.core.cache import cache
import datetime

def format_data(data_entries):
    formatted_data = {}
    for entry in data_entries:
        year = entry.year
        month = f"{entry.month:02d}"
        date_str = entry.date.strftime("%Y/%m/%d , %H:%M:%S")
        value = entry.value

        if year not in formatted_data:
            formatted_data[year] = []

        month_entry = next((m for m in formatted_data[year] if month in m), None)
        if not month_entry:
            month_entry = {month: []}
            formatted_data[year].append(month_entry)

        month_entry[month].append({date_str: value})

    return [{year: formatted_data[year]} for year in formatted_data]

class DataView(APIView):
    def get(self, request):
        data = cache.get('formatted_data')
        cache_source = 'redis' if data else 'db'
        cache_expiry = None

        if not data:
            data_entries = DataEntry.objects.all()
            data = format_data(data_entries)
            cache.set('formatted_data', data, timeout=60)  # Cache for 1 hour
            cache_source = 'db'  # Indicates data is fetched from the database
        else:
            cache_expiry = cache.ttl('formatted_data')
            cache_expiry = datetime.timedelta(seconds=cache_expiry)  # Convert TTL to datetime for easier display

        response_data = {
            'data': data,
            'cache_source': cache_source,
            'cache_expiry': str(cache_expiry) if cache_expiry else None
        }
        #cache.delete('formatted_data')
        return Response(response_data, status=status.HTTP_200_OK)
