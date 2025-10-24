from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import re
import json
from pymongo import MongoClient
import certifi
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ----------------- MongoDB Setup -----------------
MONGO_URI = os.getenv('MONGO_URI')
ca = certifi.where()
client_mongo = MongoClient(MONGO_URI, tls=True, tlsCAFile=ca)
db = client_mongo["workout_db"]          # Database name
collection = db["plans"]                 # Collection name

# ----------------- Groq Client -----------------
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "🤖 AI-Based Workout and Diet Planning System",
        "status": "running",
        "endpoints": {
            "POST /generate-plan": "Generate workout and diet plan",
            "GET /plans": "Get all saved plans",
            "GET /plans/<plan_id>": "Get specific plan by ID"
        }
    })

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    print("\n🚀 NEW PLAN GENERATION REQUEST RECEIVED")
    try:
        # Get data from request
        data = request.get_json()
        print(f"📥 Request data received: {data}")
        
        if not data:
            print("❌ Error: No JSON data provided")
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Validate required fields
        required_fields = ['present_weight', 'expected_weight', 'target_months']
        for field in required_fields:
            if field not in data:
                print(f"❌ Error: Missing required field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        present_weight = float(data['present_weight'])
        expected_weight = float(data['expected_weight'])
        target_months = int(data['target_months'])
        print(f"✅ Data validated - Weight: {present_weight}kg → {expected_weight}kg, Duration: {target_months} months")
        
        # Validate target_months
        valid_months = [2, 4, 6, 8, 12, 16, 24]
        if target_months not in valid_months:
            print(f"❌ Error: Invalid target months: {target_months}")
            return jsonify({"error": f"Target months must be one of: {valid_months}"}), 400
        
        # Create prompt dynamically based on inputs
        prompt = f"""
        You are a fitness and nutrition assistant.
        Create a personalized weekly AI-based workout and diet plan.

        Inputs:
        - Present weight: {present_weight} kg
        - Expected weight: {expected_weight} kg
        - Target months: {target_months}

        Output format:
        Return a strictly valid JSON object ONLY with the following fields:
        For each day (Mon–Sun), include:
        - treadmill (mins)
        - power_lifting (mins)
        - squats (mins)
        - dead_lift (mins)
        - cycling (mins)
        - skipping (mins)
        - calories (grams)
        - carbohydrates (grams)
        - protein (grams)
        - fat (grams)
        Do NOT include any markdown formatting, explanation, or extra text.
        """
        
        # ----------------- Generate Plan -----------------
        print("🤖 Calling Groq AI to generate plan...")
        try:
            completion = client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": "You are a professional AI workout and diet planner."},
                    {"role": "user", "content": prompt}
                ]
            )
            print("✅ AI response received from Groq")
        except Exception as groq_error:
            print(f"❌ Groq API Error: {str(groq_error)}")
            return jsonify({"error": f"AI service error: {str(groq_error)}"}), 500
        
        # Extract response
        response = completion.choices[0].message.content.strip()
        response = re.sub(r"^```[a-zA-Z]*|```$", "", response).strip()
        print(f"📝 AI response length: {len(response)} characters")
        
        # ----------------- Parse and Save -----------------
        try:
            print("🔄 Parsing JSON response...")
            plan_json = json.loads(response)
            print("✅ JSON parsed successfully")
            
            # Prepare document for MongoDB with timezone-aware UTC datetime
            plan_document = {
                "present_weight": present_weight,
                "expected_weight": expected_weight,
                "target_months": target_months,
                "plan": plan_json,
                "created_at": datetime.now(timezone.utc)  # timezone-aware
            }
            
            # Insert into MongoDB
            print("💾 Saving plan to MongoDB...")
            try:
                result = collection.insert_one(plan_document)
                print(f"✅ Plan saved to MongoDB with ID: {result.inserted_id}")
            except Exception as mongo_error:
                print(f"❌ MongoDB Error: {str(mongo_error)}")
                return jsonify({"error": f"Database error: {str(mongo_error)}"}), 500
            
            return jsonify({
                "success": True,
                "message": "Plan successfully generated and saved",
                "plan_id": str(result.inserted_id),
                "plan": plan_json,
                "metadata": {
                    "present_weight": present_weight,
                    "expected_weight": expected_weight,
                    "target_months": target_months,
                    "created_at": plan_document["created_at"].isoformat()
                }
            }), 201
            
        except json.JSONDecodeError:
            print("❌ Error: AI response is not valid JSON")
            print(f"Raw response: {response[:200]}...")
            return jsonify({
                "error": "AI response is not valid JSON",
                "raw_response": response
            }), 500
            
    except ValueError as e:
        print(f"❌ ValueError: {str(e)}")
        return jsonify({"error": f"Invalid input data: {str(e)}"}), 400
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/plans', methods=['GET'])
def get_all_plans():
    print(f"\n📋 GET ALL PLANS REQUEST - Page: {request.args.get('page', 1)}, Limit: {request.args.get('limit', 10)}")
    try:
        # Get query parameters for pagination
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit
        print(f"📊 Fetching plans: page {page}, limit {limit}, skip {skip}")
        
        # Get plans from MongoDB
        plans_cursor = collection.find().sort("created_at", -1).skip(skip).limit(limit)
        plans = []
        
        for plan in plans_cursor:
            plan['_id'] = str(plan['_id'])
            plan['created_at'] = plan['created_at'].isoformat()
            plans.append(plan)
        
        # Get total count
        total_count = collection.count_documents({})
        print(f"✅ Found {len(plans)} plans out of {total_count} total")
        
        return jsonify({
            "success": True,
            "plans": plans,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": (total_count + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error retrieving plans: {str(e)}")
        return jsonify({"error": f"Error retrieving plans: {str(e)}"}), 500

@app.route('/plans/<plan_id>', methods=['GET'])
def get_plan_by_id(plan_id):
    print(f"\n🔍 GET PLAN BY ID REQUEST - ID: {plan_id}")
    try:
        from bson import ObjectId
        
        # Validate ObjectId format
        try:
            object_id = ObjectId(plan_id)
            print(f"✅ Valid ObjectId format")
        except:
            print(f"❌ Invalid ObjectId format: {plan_id}")
            return jsonify({"error": "Invalid plan ID format"}), 400
        
        # Find plan in MongoDB
        print(f"🔍 Searching for plan in MongoDB...")
        plan = collection.find_one({"_id": object_id})
        
        if not plan:
            print(f"❌ Plan not found with ID: {plan_id}")
            return jsonify({"error": "Plan not found"}), 404
        
        print(f"✅ Plan found successfully")
        
        # Convert ObjectId to string and datetime to ISO format
        plan['_id'] = str(plan['_id'])
        plan['created_at'] = plan['created_at'].isoformat()
        
        return jsonify({
            "success": True,
            "plan": plan
        }), 200
        
    except Exception as e:
        print(f"❌ Error retrieving plan: {str(e)}")
        return jsonify({"error": f"Error retrieving plan: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    print(f"\n🏥 HEALTH CHECK REQUEST")
    try:
        # Test MongoDB connection
        print("🔍 Testing MongoDB connection...")
        client_mongo.admin.command('ping')
        print("✅ MongoDB connection successful")
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }), 200
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }), 500

if __name__ == '__main__':
    print("🤖 AI-Based Workout and Diet Planning System - Flask API")
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=8000)
