
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quizz
from questions.models import Question
from questions.serializers import QuestionSerializer
from .serializers import QuizzSerializer, QuizzEditSerializer
from rest_framework.generics import CreateAPIView
from rest_framework import status


class QuizListView(APIView):
    def get(self, request):
        quizzes = Quizz.objects.all()
        deleted_questions = Question.objects.filter(is_deleted=True)

        quiz_serializer = QuizzSerializer(quizzes, many=True)
        deleted_serializer = QuestionSerializer(deleted_questions, many=True)

        return Response({
            'quizzes': quiz_serializer.data,
            'deleted_questions': deleted_serializer.data
        })

class QuizDeleteView(APIView):
    def delete(self, request, pk):
        try:
            quizz = Quizz.objects.get(pk=pk)
        except Quizz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        related_questions = list(quizz.questions.all())

        quizz.delete()

        for question in related_questions:
            if question.quizzes.count() == 0:
                question.is_deleted = True
                question.save()
        quizzes = Quizz.objects.all()
        serializer = QuizzSerializer(quizzes, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class QuizEditView(APIView):
    def put(self, request, pk):
        try:
            quizz = Quizz.objects.get(pk=pk)
        except Quizz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        title = data.get('title')
        questions_data = data.get('questions', [])

        original_questions = set(quizz.questions.all())

        updated_questions = []

        for q in questions_data:
            if 'id' in q:
                try:
                    question = Question.objects.get(pk=q['id'])
                    question.is_deleted = False
                    question.question = q['question']
                    question.answer = q['answer']
                    question.save()
                    updated_questions.append(question)
                except Question.DoesNotExist:
                    continue  
            else:
                question = Question.objects.create(
                    question=q['question'],
                    answer=q['answer'],
                    is_deleted=False
                )
                updated_questions.append(question)

        quizz.title = title
        quizz.save()

        quizz.questions.set(updated_questions)

        removed_questions = original_questions - set(updated_questions)
        deleted_questions = []
        
        for q in removed_questions:
            if q.quizzes.count() == 1:  
                q.is_deleted = True
                q.save()
        
        deleted_questions = Question.objects.filter(is_deleted=True)

        quiz_serializer = QuizzSerializer(quizz)
        deleted_serializer = QuestionSerializer(deleted_questions, many=True)

        return Response({
            "quiz": quiz_serializer.data,
            "deleted_questions": deleted_serializer.data
        }, status=status.HTTP_200_OK)


class QuizCreateView(CreateAPIView):
    queryset = Quizz.objects.all()
    serializer_class = QuizzSerializer