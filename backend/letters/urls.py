"""URL configuration for letters app."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LetterViewSet,
    LetterTypeViewSet,
    letter_public_view,
)

router = DefaultRouter()
router.register(r'admin/letters', LetterViewSet, basename='letter')
router.register(r'admin/letter-types', LetterTypeViewSet, basename='lettertype')

urlpatterns = [
    # Public endpoints
    path('letters/<slug:slug>/', letter_public_view, name='letter-public'),

    # Router URLs (admin endpoints)
    path('', include(router.urls)),
]
