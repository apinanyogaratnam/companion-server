from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
import os, requests, json

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Companion API :)"


if __name__ == '__main__':
    app.run(debug=False)
