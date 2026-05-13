from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import timedelta, datetime
import os
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]}})

app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/llb_mini")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-jwt-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

mongo = PyMongo(app)
jwt = JWTManager(app)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if mongo.db.users.find_one({"$or": [{"username": username}, {"email": email}]}):
        return jsonify({"error": "Username or email already exists"}), 409

    new_user = {
        "username": username,
        "email": email,
        "password_hash": generate_password_hash(password)
    }
    
    result = mongo.db.users.insert_one(new_user)
    
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": {"id": str(result.inserted_id), "username": username, "email": email}
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = mongo.db.users.find_one({"username": username})

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        "token": access_token,
        "user": {"id": str(user['_id']), "username": user['username'], "email": user['email']}
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "user": {"id": str(user['_id']), "username": user['username'], "email": user['email']}
    }), 200

@app.route('/api/analyses', methods=['POST'])
@jwt_required()
def save_analysis():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No analysis data provided"}), 400
        
    overview = data.get("analysis_overview", {})
    
    analysis_record = {
        "user_id": ObjectId(current_user_id),
        "file_name": data.get("fileName", "Unknown"),
        "document_size": data.get("documentLength", data.get("document_length", 0)),
        "risk_level": overview.get("overall_risk_level", "low"),
        "risk_score": overview.get("risk_score", 0),
        "document_type": overview.get("document_type", "General Legal Agreement"),
        "analysis_data": data,
        "created_at": datetime.utcnow()
    }
    
    result = mongo.db.analyses.insert_one(analysis_record)
    return jsonify({"message": "Analysis saved successfully", "id": str(result.inserted_id)}), 201

@app.route('/api/analyses', methods=['GET'])
@jwt_required()
def get_analyses():
    current_user_id = get_jwt_identity()
    analyses = mongo.db.analyses.find({"user_id": ObjectId(current_user_id)}).sort("created_at", -1)
    
    result = []
    for a in analyses:
        result.append({
            "id": str(a['_id']),
            "file_name": a.get("file_name"),
            "document_size": a.get("document_size"),
            "risk_level": a.get("risk_level", "low"),
            "risk_score": a.get("risk_score", 0),
            "document_type": a.get("document_type", "General Legal Agreement"),
            "created_at": a.get("created_at")
        })
        
    return jsonify({"analyses": result}), 200

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    user_id_obj = ObjectId(current_user_id)
    
    high_risk_count = mongo.db.analyses.count_documents({"user_id": user_id_obj, "risk_level": "high"})
    med_risk_count = mongo.db.analyses.count_documents({"user_id": user_id_obj, "risk_level": "medium"})
    low_risk_count = mongo.db.analyses.count_documents({"user_id": user_id_obj, "risk_level": "low"})
    
    # Generate intelligence feed from recent documents
    recent_docs = mongo.db.analyses.find({"user_id": user_id_obj}).sort("created_at", -1).limit(5)
    intelligence_feed = []
    
    for doc in recent_docs:
        if doc.get("risk_level") == "high":
            intelligence_feed.append({
                "type": "Critical Insight",
                "message": f"Critical risk detected in {doc.get('file_name', 'document')}.",
                "tags": ["Compliance", "Action Required"],
                "time": doc.get("created_at").strftime("%Y-%m-%d %H:%M") if doc.get("created_at") else "Recently",
                "color": "error"
            })
        elif doc.get("risk_level") == "medium":
            intelligence_feed.append({
                "type": "Warning",
                "message": f"Medium risk clauses found in {doc.get('file_name', 'document')}.",
                "tags": ["Review Suggested"],
                "time": doc.get("created_at").strftime("%Y-%m-%d %H:%M") if doc.get("created_at") else "Recently",
                "color": "tertiary"
            })
        else:
            intelligence_feed.append({
                "type": "Summary Generated",
                "message": f"Executive summary ready for {doc.get('file_name', 'document')}.",
                "tags": ["Auto-Generated"],
                "time": doc.get("created_at").strftime("%Y-%m-%d %H:%M") if doc.get("created_at") else "Recently",
                "color": "primary"
            })
            
    return jsonify({
        "risk_atlas": {
            "high": high_risk_count,
            "medium": med_risk_count,
            "low": low_risk_count
        },
        "active_tasks": [],
        "active_ingestions": 0,
        "intelligence_feed": intelligence_feed[:3]
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
