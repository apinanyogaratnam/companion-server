from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
import os, requests, json
from pymongo import MongoClient

load_dotenv()
app = Flask(__name__)
CORS(app)

DB_URI = os.getenv("DB_URI")

@app.route('/')
def index():
    return "Companion API :)"


@app.route('/api/v1/')
def get_all_data():
    client = pymongo.MongoClient(DB_URI)
    db = client.test

if __name__ == '__main__':
    app.run(debug=False)
