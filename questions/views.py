from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer

class DeletedQuestionsView(APIView):
    def get(self, request):
        deleted_questions = Question.objects.filter(is_deleted=True)
        serializer = QuestionSerializer(deleted_questions, many=True)
        return Response(serializer.data)