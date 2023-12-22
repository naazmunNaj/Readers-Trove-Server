from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# MongoDB connection
client = MongoClient(os.environ.get("DB_URI"))
db = client.readersTrove
book_categories_collection = db.bookCategories
all_category_books_collection = db.allCategoryBooks
borrowed_books_collection = db.borrowedBooks

@app.route('/bookCategories', methods=['GET'])
def get_book_categories():
    cursor = book_categories_collection.find()
    result = list(cursor)
    return jsonify(result)

@app.route('/allCategoryBooks', methods=['GET'])
def get_all_category_books():
    cursor = all_category_books_collection.find()
    result = list(cursor)
    return jsonify(result)

@app.route('/allCategoryBooks/<id>', methods=['GET'])
def get_single_category_book(id):
    query = {"_id": ObjectId(id)}
    book = all_category_books_collection.find_one(query)
    return jsonify(book)

@app.route('/borrowedBooks', methods=['POST'])
def add_borrowed_book():
    order = request.get_json()
    result = borrowed_books_collection.insert_one(order)
    return jsonify(str(result.inserted_id))

@app.route('/borrowedBooks', methods=['GET'])
def get_borrowed_books():
    result = borrowed_books_collection.find()
    books = list(result)
    return jsonify(books)

@app.route('/borrowedBooks/<id>', methods=['DELETE'])
def delete_borrowed_book(id):
    query = {"_id": ObjectId(id)}
    result = borrowed_books_collection.delete_one(query)
    return jsonify({"deleted_count": result.deleted_count})

@app.route('/')
def home():
    return 'Trove is working'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
