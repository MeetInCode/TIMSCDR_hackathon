from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Groq client with your API key
client = Groq(api_key='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')

def fetch_mentors(question):
    """Fetches details of 5 Indian mentors from Groq API based on the user's input."""
    try:
        if not question:
            return jsonify({"error": "Question is required"}), 400

        # Mentor JSON Template (formatted correctly)
        mentor_template = """{
  "mentors": [
    {
      "id": "1",
      "name": "Dr. Rajesh Sharma",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      "title": "Expert Physics Mentor",
      "total_students": "1200",
      "reviews": "1500",
      "specialization": "Physics",
      "experience": "15 years",
      "education": "Ph.D. in Physics from IIT Delhi",
      "bio": "Dr. Rajesh Sharma is a renowned Physics mentor with a Ph.D. from IIT Delhi. He specializes in teaching complex Physics concepts in a simplified manner.",
      "rating": 4.9,
      "courses": [
        "Class 11 Physics",
        "Class 12 Physics",
        "JEE Main Physics",
        "JEE Advanced Physics"
      ],
      "achievements": [
        "Author of 'Mastering Physics'",
        "10+ years of teaching experience",
        "Mentored 5000+ students"
      ],
      "contact": {
        "website": "https://drsharma.com",
        "linkedin": "https://linkedin.com/in/drsharma"
      }
    },
    {
      "id": "2",
      "name": "Prof. Anjali Gupta",
      "image": "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=200&h=200",
      "title": "Physics Education Specialist",
      "total_students": "1800",
      "reviews": "2000",
      "specialization": "Physics",
      "experience": "20 years",
      "education": "M.Sc. in Physics from IIT Bombay",
      "bio": "Prof. Anjali Gupta is a dedicated Physics educator with over 20 years of experience. She is known for her innovative teaching methods.",
      "rating": 4.8,
      "courses": [
        "NEET Physics",
        "CBSE Physics",
        "ICSE Physics",
        "Foundation Physics"
      ],
      "achievements": [
        "Recipient of the National Teacher Award",
        "Published 5 research papers in Physics education",
        "Trained 1000+ teachers"
      ],
      "contact": {
        "website": "https://profanjali.com",
        "linkedin": "https://linkedin.com/in/profanjali"
      }
    },
    {
      "id": "3",
      "name": "Mr. Suresh Kumar",
      "image": "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=200&h=200",
      "title": "Physics Mentor & Researcher",
      "total_students": "1500",
      "reviews": "1800",
      "specialization": "Physics",
      "experience": "18 years",
      "education": "M.Tech. in Physics from IISc Bangalore",
      "bio": "Mr. Suresh Kumar is a Physics mentor and researcher with a passion for making Physics accessible to all students.",
      "rating": 4.7,
      "courses": [
        "Advanced Physics",
        "Physics for Competitive Exams",
        "Physics for Engineers",
        "Physics for Scientists"
      ],
      "achievements": [
        "Published 10+ research papers",
        "Mentored students who cracked JEE & NEET",
        "Conducted workshops at IITs"
      ],
      "contact": {
        "website": "https://sureshkumar.com",
        "linkedin": "https://linkedin.com/in/sureshkumar"
      }
    },
    {
      "id": "4",
      "name": "Ms. Priya Patel",
      "image": "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=200&h=200",
      "title": "Physics Tutor & Educator",
      "total_students": "1000",
      "reviews": "1200",
      "specialization": "Physics",
      "experience": "10 years",
      "education": "B.Tech. in Physics from NIT Surat",
      "bio": "Ms. Priya Patel is a passionate Physics tutor who believes in the power of interactive learning.",
      "rating": 4.6,
      "courses": [
        "Basic Physics Concepts",
        "Intermediate Physics",
        "Advanced Physics Topics",
        "Physics for Young Learners"
      ],
      "achievements": [
        "Young Educator Award 2020",
        "Featured in 'Top 10 Physics Tutors'",
        "Developed interactive Physics learning tools"
      ],
      "contact": {
        "website": "https://priyapatel.com",
        "linkedin": "https://linkedin.com/in/priyapatel"
      }
    },
    {
      "id": "5",
      "name": "Dr. Vivek Singh",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      "title": "Senior Physics Mentor",
      "total_students": "2000",
      "reviews": "2500",
      "specialization": "Physics",
      "experience": "25 years",
      "education": "Ph.D. in Physics from IIT Kanpur",
      "bio": "Dr. Vivek Singh is a senior Physics mentor with over 25 years of experience in teaching and research.",
      "rating": 4.9,
      "courses": [
        "Physics for IIT JEE",
        "Physics for NEET",
        "Physics for CBSE",
        "Physics for ICSE"
      ],
      "achievements": [
        "Author of 'Physics Made Easy'",
        "Mentored 1000+ IIT & NEET qualifiers",
        "Recipient of the Lifetime Achievement Award"
      ],
      "contact": {
        "website": "https://drviveksingh.com",
        "linkedin": "https://linkedin.com/in/drviveksingh"
      }
    }
  ]
}
"""

        # System Prompt to enforce valid JSON response
        system_prompt = f"""Generate JSON data for a list of 5 realistic Indian mentors. Each mentor should include the following details:

ID (unique identifier)
Name
Image URL
Title (e.g., "Senior Physics Mentor")
Total Students Taught
Number of Reviews
Specialization (e.g., "Physics")
Experience (in years)
Education (e.g., "Ph.D. in Physics from IIT Delhi")
Bio (a short description of their background)
Rating (out of 5)
Courses Offered (list of courses)
Achievements (list of notable achievements)
Contact Information (website and LinkedIn)


        """

        # Chat Completion Request
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            model="llama-3.3-70b-specdec",
            response_format={"type": "json_object"},
            temperature=0.5,
            max_completion_tokens=4096,
            top_p=1,
        )

        return (chat_completion.choices[0].message.content)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/mentors', methods=['POST'])
def get_mentors():
    """Handles POST request to fetch mentors."""
    data = request.get_json()
    return fetch_mentors(data.get("question"))


if __name__ == '__main__':
    app.run(debug=True)
