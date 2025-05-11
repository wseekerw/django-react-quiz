from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from .models import Quizz
from questions.models import Question
from rest_framework import status

class QuizListViewTest(APITestCase):
    def setUp(self):
        self.question1 = Question.objects.create(question="Active Q1", answer="A1", is_deleted=False)
        self.question2 = Question.objects.create(question="Active Q2", answer="A2", is_deleted=False)

        self.deleted_q = Question.objects.create(question="Deleted Q", answer="DA", is_deleted=True)

        self.quiz = Quizz.objects.create(title="Sample Quiz")
        self.quiz.questions.set([self.question1, self.question2])

    def test_quiz_list_includes_deleted_questions(self):
        response = self.client.get('/api/quizzes/list/')  
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('quizzes', response.data)
        self.assertIn('deleted_questions', response.data)

        quiz_titles = [q['title'] for q in response.data['quizzes']]
        self.assertIn(self.quiz.title, quiz_titles)

        deleted_questions_text = [q['question'] for q in response.data['deleted_questions']]
        self.assertIn(self.deleted_q.question, deleted_questions_text)


class QuizDeleteViewTest(APITestCase):
    def setUp(self):
        self.question1 = Question.objects.create(question="Q1", answer="A1")
        self.question2 = Question.objects.create(question="Q2", answer="A2")

        self.quiz = Quizz.objects.create(title="Sample Quiz")
        self.quiz.questions.set([self.question1, self.question2])

        self.another_quiz = Quizz.objects.create(title="Another Quiz")
        self.another_quiz.questions.add(self.question2)

    def test_quiz_delete_marks_orphaned_questions_deleted(self):

        response = self.client.delete(f'/api/quizzes/delete/{self.quiz.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertFalse(Quizz.objects.filter(id=self.quiz.id).exists())

        self.question1.refresh_from_db()
        self.assertTrue(self.question1.is_deleted)

        self.question2.refresh_from_db()
        self.assertFalse(self.question2.is_deleted)

        remaining_quiz_ids = [q['id'] for q in response.data]
        self.assertIn(self.another_quiz.id, remaining_quiz_ids)