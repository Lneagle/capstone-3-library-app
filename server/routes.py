from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from config import db
from models import *
from utils import error_response, success_response

def create_or_return_author(author_obj):
	author = Author.query.filter_by(olid=author_obj['olid']).first()

	if author:
		return author
	else:
		try:
			new_author = Author(name=author_obj['name'], olid=author_obj['olid'])
			db.session.add(new_author)
			db.session.commit()
			return(new_author)
		except IntegrityError as e:
			db.session.rollback()
			return error_response('Database constraint violation', 422)

class BookIndex(Resource):
	def get(self):
		books = Book.query.all()

		if not books:
			return error_response('No books found', 404)
		else:
			return success_response([BookSchema().dump(book) for book in books])
		
	def post(self):
		request_json = request.get_json()

		if not request_json:
			return error_response('Request body required', 400)
		
		if 'title' not in request_json or 'olid' not in request_json:
			return error_response('Title and olid are required', 400)
		
		if 'authors' not in request_json:
			return error_response('Authors required (use empty array if there are none)', 400)
		
		book = Book.query.filter_by(olid=request_json['olid']).first()
		if book:
			return error_response('Book already exists', 409)
		
		book_title = request_json['title']
		book_olid = request_json['olid']
		book_cover = f'https://covers.openlibrary.org/b/id/{request_json['cover_image']}-M.jpg' if request_json['cover_image'] else 'https://placehold.co/180x290.png?text=No%20Image'
		book_description = request_json['description']
		book_rating = request_json['rating']
		authors = request_json['authors']
		
		try:
			new_book = Book(title=book_title, olid=book_olid, cover_image=book_cover)
			if book_description:
				new_book.description = book_description
			if book_rating:
				new_book.rating = book_rating
			for author in authors:
				print(author)
				if not author['name'] or not author['olid']:
					return error_response('Author name and olid are required for each author', 400)
				new_book.authors.append(create_or_return_author(author))
			db.session.add(new_book)
			db.session.commit()
			return success_response(BookSchema().dump(new_book))
		except IntegrityError as e:
			db.session.rollback()
			return error_response('Database constraint violation', 422)