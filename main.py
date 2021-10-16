from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
import os, requests, json
from pymongo import MongoClient

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Companion API :)"


@app.route('/api/v1/')

if __name__ == '__main__':
    app.run(debug=False)
