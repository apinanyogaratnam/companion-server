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
def get_all_data():
    client = pymongo.MongoClient("mongodb+srv://admin:admin@cluster0.zodle.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = client.test

if __name__ == '__main__':
    app.run(debug=False)
