from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Bienvenue dans l'API Manga"})
