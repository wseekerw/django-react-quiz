from django.urls import path
from .views import QuizListView, QuizCreateView, QuizEditView, QuizDeleteView

urlpatterns = [
    path('list/', QuizListView.as_view(), name='quizz-list'),
    path('create/', QuizCreateView.as_view(), name='quizz-create'),
    path('delete/<int:pk>/', QuizDeleteView.as_view(), name='quizz-delete'),  
    path('update/<int:pk>/', QuizEditView.as_view(), name='quizz-update'),  
]