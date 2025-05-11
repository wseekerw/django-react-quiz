from django.db import models
from questions.models import Question

class Quizz(models.Model):
    
    title = models.CharField(max_length=255)
    questions = models.ManyToManyField(Question, related_name='quizzes')
    
    def __str__(self):
        return self.title