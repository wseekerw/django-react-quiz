from django.db import models

class QuestionManager(models.Manager):
    def deleted(self):
        return self.filter(is_deleted=True)

class Question(models.Model):
    
    question = models.TextField()
    answer = models.TextField()
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.question
    
    objects = QuestionManager()
