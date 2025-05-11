from rest_framework import serializers
from .models import Quizz
from questions.serializers import QuestionSerializer
from questions.models import Question

class QuizzSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    class Meta:
        model = Quizz
        fields = ['id', 'title', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quizz = Quizz.objects.create(title=validated_data['title'])

        for question_data in questions_data:
            question = Question.objects.create(**question_data)
            quizz.questions.add(question)
        return quizz    
    
    """
        Example of request data:
        {
            "title": "My Quiz",
            "questions": [
                {"question": "Q1", "answer": "A1"},
                {"question": "Q2", "answer": "A2"}
            ]
        }
    """

class QuizzEditSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quizz
        fields = ['id', 'title', 'questions']    