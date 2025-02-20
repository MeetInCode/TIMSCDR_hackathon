import json
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
import os
from dotenv import load_dotenv
from groq import Groq

from api.example import format_query

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Appwrite Client
client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))

# Global Database, Collection, and Bucket IDs
DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")
COLLECTION_ID = os.getenv("APPWRITE_COLLECTION_ID")
BUCKET_ID = os.getenv("APPWRITE_BUCKET_ID")

databases = Databases(client)
storage = Storage(client)   

# Initialize Groq client with your API key (near the top with other initializations)
groq_client = Groq(api_key='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')

@app.route("/api/add_document", methods=["POST"])
def add_document():
    data = request.json
    try:
        response = databases.create_document(
            database_id=DATABASE_ID,
            collection_id=COLLECTION_ID,
            document_id=data["document_id"],
            data=data["data"]
        )
        return jsonify({"message": "Document added successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/list_documents", methods=["GET"])
def list_documents():
    try:
        response = databases.list_documents(DATABASE_ID, COLLECTION_ID)
        return jsonify({"documents": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/delete_file", methods=["DELETE"])
def delete_file():
    data = request.json
    try:
        storage.delete_file(bucket_id=BUCKET_ID, file_id=data["file_id"])
        return jsonify({"message": "File deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/get_file", methods=["GET"])
def get_file():
    file_id = request.args.get("file_id")
    try:
        response = storage.get_file(bucket_id=BUCKET_ID, file_id=file_id)
        return jsonify({"file": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/request_to_python_file', methods=['POST'])
def handle_query():
    try:
        data = request.get_json()
        query = data.get("query")
        if not query:
            return jsonify({"error": "Query parameter is required"}), 400
        
        response_str = format_query(query)  # This returns a JSON string
        response = json.loads(response_str)  # Convert string back to dictionary
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/mentor/videos/<mentor_id>", methods=["GET"])
def get_mentor_videos(mentor_id):
    try:
        # Debug logging
        print(f"Fetching all videos")
        
        # Use the correct database and collection IDs
        database_id = "678b86ed000eb82e40c4"  # Your Appwrite database ID
        collection_id = "67b6c64700266f87ce90"  # Your Appwrite collection ID
        
        print(f"Using Database ID: {database_id}")
        print(f"Using Collection ID: {collection_id}")
        
        # Query all documents without filters
        response = databases.list_documents(
            database_id=database_id,
            collection_id=collection_id
        )
        
        print("Appwrite response:", response)
        return jsonify({"videos": response}), 200
        
    except Exception as e:
        print("Error in get_mentor_videos:", str(e))
        return jsonify({"error": str(e)}), 400

@app.route("/api/view_file/<file_id>", methods=["GET"])
def view_file(file_id):
    try:
        # Get the file from Appwrite storage
        result = storage.get_file_view(
            bucket_id="67b6c52e00328189f1e8",
            file_id=file_id
        )
        
        # Get the file info to determine the MIME type
        file_info = storage.get_file(
            bucket_id="67b6c52e00328189f1e8",
            file_id=file_id
        )
        
        # Set the correct content type
        mime_type = file_info.get('mimeType', 'video/mp4')
        
        # Return the response with proper headers
        return Response(
            result,
            mimetype=mime_type,
            headers={
                'Content-Type': mime_type,
                'Accept-Ranges': 'bytes',
                'Access-Control-Allow-Origin': '*'
            }
        )
    except Exception as e:
        print("Error viewing file:", str(e))
        return jsonify({"error": str(e)}), 400
    
@app.route("/api/upload_file", methods=["POST"])
def upload_file():
    file = request.files['file']
    file_path = "./temp_upload_file"
    file.save(file_path)
    
    try:
        file_to_upload = InputFile.from_path(file_path)
        response = storage.create_file(bucket_id=BUCKET_ID, file_id='unique()', file=file_to_upload)
        return jsonify({"message": "File uploaded successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route("/api/mentor/upload_video", methods=["POST"])
def upload_mentor_video():
    try:
        file = request.files['video']
        title = request.form.get('title')
        description = request.form.get('description')
        mentor_id = request.form.get('mentor_id')
        
        # Save video to storage
        file_path = "./temp_upload_video"
        file.save(file_path)
        
        file_to_upload = InputFile.from_path(file_path)
        file_response = storage.create_file(
            bucket_id=BUCKET_ID,
            file_id='unique()',
            file=file_to_upload
        )
        
        # Save video metadata to database
        video_data = {
            "title": title,
            "description": description,
            "mentor_id": mentor_id,
            "file_id": file_response["$id"],
            "type": "mentor_video"
        }
        
        doc_response = databases.create_document(
            database_id=DATABASE_ID,
            collection_id="67b6c64700266f87ce90",
            document_id='unique()',
            data=video_data
        )
        
        return jsonify({
            "message": "Video uploaded successfully",
            "file": file_response,
            "document": doc_response
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/list_files", methods=["GET"])
def list_files():
    try:
        files = storage.list_files(bucket_id=BUCKET_ID)
        return jsonify({"files": files}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/quiz', methods=['POST','GET'])
def quiz():
    try:
        data = request.get_json()
        title = data.get("title")
        desc = data.get("desc")
        
        # Debug logs
        print("Received quiz request with data:")
        print(f"Title: {title}")
        print(f"Description: {desc}")
        
        if not title or not desc:
            print("Missing title or description")
            return jsonify({"error": "Both title and description are required"}), 400
        
        try:
            # Initialize Groq client
            client = Groq(api_key="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")
            
            # Construct a more specific prompt
            prompt = f"""Create 5 multiple choice questions based on this lecture:
            Title: {title}
            Description: {desc}

            Format your response as a JSON object with this EXACT structure:
            {{
                "aiQuiz": {{
                    "questions": [
                        {{
                            "question": "Your question here?",
                            "options": [
                                "First option",
                                "Second option",
                                "Third option",
                                "Fourth option"
                            ],
                            "correctAnswer": "The correct option (must match exactly one of the options)"
                        }}
                    ]
                }}
            }}

            Requirements:
            1. Generate exactly 5 questions
            2. Each question must have exactly 4 options
            3. The correctAnswer must match exactly one of the options
            4. Questions should test understanding of the lecture content
            5. Return ONLY the JSON object, no additional text
            """
            
            print("Sending request to Groq...")
            
            completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a quiz generator that creates multiple choice questions. You ONLY respond with properly formatted JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="mixtral-8x7b-32768",  # Using Mixtral model for better structured output
                temperature=0.5,  # Lower temperature for more consistent output
                max_tokens=2000,
                top_p=0.9
            )
            
            # Get the response content
            response_content = completion.choices[0].message.content.strip()
            print("Raw Groq response:", response_content)
            
            # Parse the JSON response
            try:
                response_json = json.loads(response_content)
                print("Parsed response:", response_json)
                
                # Validate the response structure
                if not isinstance(response_json, dict) or 'aiQuiz' not in response_json:
                    raise ValueError("Invalid response structure")
                
                return jsonify(response_json)
                
            except json.JSONDecodeError as json_error:
                print("JSON parsing error:", str(json_error))
                raise
            
        except Exception as groq_error:
            print("Groq API error:", str(groq_error))
            raise
            
    except Exception as e:
        print("General error in quiz endpoint:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentors', methods=['POST'])
def get_mentors():
    """Handles POST request to fetch mentors."""
    try:
        data = request.get_json()
        question = data.get("question")
        
        if not question:
            return jsonify({"error": "Question is required"}), 400

        # System Prompt to enforce valid JSON response
        system_prompt = """Generate JSON data for a list of 5 realistic Indian mentors. Each mentor should include the following details:

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
        chat_completion = groq_client.chat.completions.create(
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

        return chat_completion.choices[0].message.content

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/hello", methods=["GET"])
def hello_world():
    return jsonify({"message": "Hello World!"}), 200

if __name__ == "__main__":
    app.run(debug=True)
