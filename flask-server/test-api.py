import unittest
from main import create_app
from config import TestConfig
from exts import db
from models import Recipe, User

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            # Optionally add initial data for testing
            test_recipe = Recipe(title="Sample Recipe", description="Sample Description")
            db.session.add(test_recipe)
            db.session.commit()

    def test_hello_world(self):
        """Test the Hello World endpoint"""
        response = self.client.get('/recipes/hello')
        json_data = response.get_json()
        print("Hello World Response:", json_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_data, {"message": "Hello world"})
    
    def test_signup(self):
        """Test user signup"""
        response = self.client.post('/auth/signup',
            json={"username": "testuser", "email": "testuser@test.com", "password": "password"}
        )
        self.assertEqual(response.status_code, 201)

    def test_login(self):
        """Test user login"""
        # Ensure user exists before login
        self.client.post('/auth/signup',
            json={"username": "testuser", "email": "testuser@test.com", "password": "password"}
        )
        response = self.client.post('/auth/login',
            json={"username": "testuser", "password": "password"}
        )
        self.assertEqual(response.status_code, 200)

    def test_get_all_recipes(self):
        """Test getting all recipes"""
        response = self.client.get('/recipes/recipes')
        json_data = response.get_json()
        print("Get All Recipes Response:", json_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json_data, [{'id': 1, 'title': 'Sample Recipe', 'description': 'Sample Description'}])

    def tearDown(self):
        """Cleanup after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

if __name__ == "__main__":
    unittest.main()
