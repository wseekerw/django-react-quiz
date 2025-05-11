This is a django-react(monorepo) project made for practice.

It contains quizzess and questions. Users can create quiz, and questions, and start a quiz.

Frontend react application is located in react_quizz folder.The already compiled frontend app is located 
in react_quizz/dist folder which will be served by django server once it is running.

To start the whole app:

1. Create python environment and activate it
2. Instal packages: pip install -r requirements.txt
3. Run initial migration: python manage.py migrate
4. Start the server: python manage.py runserver.
