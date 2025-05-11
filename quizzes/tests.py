from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from .models import Quizz
from questions.models import Question
from rest_framework import status

class QuizListViewTest(APITestCase):
    def setUp(self):
        # Create two questions
        self.question1 = Question.objects.create(question="Active Q1", answer="A1", is_deleted=False)
        self.question2 = Question.objects.create(question="Active Q2", answer="A2", is_deleted=False)

        # Create is_deleted question
        self.deleted_q = Question.objects.create(question="Deleted Q", answer="DA", is_deleted=True)

        # Create quiz and attach active questions
        self.quiz = Quizz.objects.create(title="Sample Quiz")
        self.quiz.questions.set([self.question1, self.question2])

    def test_quiz_list_includes_deleted_questions(self):
        # Get the endpoint
        response = self.client.get('/api/quizzes/list/')  
        
        # Tests
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('quizzes', response.data)
        self.assertIn('deleted_questions', response.data)

        # Test the title of the quiz
        quiz_titles = [q['title'] for q in response.data['quizzes']]
        self.assertIn(self.quiz.title, quiz_titles)

        # Test deleted questions
        deleted_questions_text = [q['question'] for q in response.data['deleted_questions']]
        self.assertIn(self.deleted_q.question, deleted_questions_text)


class QuizDeleteViewTest(APITestCase):
    def setUp(self):
        # Create two questions
        self.question1 = Question.objects.create(question="Q1", answer="A1")
        self.question2 = Question.objects.create(question="Q2", answer="A2")

        # Create one quiz and add the two questions
        self.quiz = Quizz.objects.create(title="Sample Quiz")
        self.quiz.questions.set([self.question1, self.question2])

        # Create another quiz and connect question 2
        self.another_quiz = Quizz.objects.create(title="Another Quiz")
        self.another_quiz.questions.add(self.question2)

    def test_quiz_delete_marks_orphaned_questions_deleted(self):
        # Get the endpoint
        response = self.client.delete(f'/api/quizzes/delete/{self.quiz.id}/')

        # Test the response
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test if there is a deleted quiz
        self.assertFalse(Quizz.objects.filter(id=self.quiz.id).exists())

        # Test if question 1 is_deleted = True
        self.question1.refresh_from_db()
        self.assertTrue(self.question1.is_deleted)

        # q2 should still not be marked as deleted because it's used in another quiz
        self.question2.refresh_from_db()
        self.assertFalse(self.question2.is_deleted)

        # Response should contain the list of remaining quizzes
        remaining_quiz_ids = [q['id'] for q in response.data]
        self.assertIn(self.another_quiz.id, remaining_quiz_ids)