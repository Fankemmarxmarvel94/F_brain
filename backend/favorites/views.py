from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Favorite
from .serializers import FavoriteSerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        manga_id = request.data.get('manga_id')
        if not manga_id:
            return Response({'error': 'manga_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user, manga_id=manga_id
        )
        
        if not created:
            favorite.delete()
            return Response({'status': 'removed'})
        
        return Response({'status': 'added'})
