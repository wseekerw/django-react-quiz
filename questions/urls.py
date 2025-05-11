from django.urls import path
from .views import DeletedQuestionsView

urlpatterns = [
    path('deleted/', DeletedQuestionsView.as_view(), name='deleted-questions'),
]