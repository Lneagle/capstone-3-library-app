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
			return new_author
		except IntegrityError as e:
			db.session.rollback()
			return error_response('Database constraint violation', 422)
		
def create_book(book_obj):
	book_title = book_obj['title']
	book_olid = book_obj['olid']
	book_cover = f'https://covers.openlibrary.org/b/id/{book_obj['cover_image']}-M.jpg' if book_obj['cover_image'] else 'https://placehold.co/180x290.png?text=No%20Image'
	book_description = book_obj['description']
	book_rating = book_obj['rating']
	authors = book_obj['authors']
	
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
		return new_book
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
		
		create_book_response = create_book(request_json)
		if isinstance(create_book_response, Book):
			return success_response(BookSchema().dump(create_book_response))
		else:
			return create_book_response
		
class BookById(Resource):
	def get(self, id):
		book = Book.query.filter_by(id=id).first()

		if book:
			return success_response(BookSchema().dump(book))
		else:
			return error_response('Book not found', 404)
		
class ListEntriesByList(Resource):
	def get(self, user_id, list_type):
		list_entries = ListEntry.query.filter_by(user_id=user_id, list_type=list_type).all()

		if not list_entries:
			return error_response('No entries found', 404)
		
		if list_type not in ['have_read', 'want_to_read']:
			return error_response('List type must be "have_read" or "want_to_read"', 400)
		
		# Do user_id check

		return success_response([ListEntrySchema().dump(entry) for entry in list_entries])
	
	def post(self, user_id, list_type):
		request_json = request.get_json()

		if list_type not in ['have_read', 'want_to_read']:
			return error_response('List type must be "have_read" or "want_to_read"', 400)
		
		# Do user_id check

		if not request_json:
			return error_response('Request body required', 400)
		
		if 'title' not in request_json or 'olid' not in request_json:
			return error_response('Title and olid are required', 400)
		
		if 'authors' not in request_json:
			return error_response('Authors required (use empty array if there are none)', 400)

		book = Book.query.filter_by(olid=request_json['olid']).first()

		if not book:
			create_book_response = create_book(request_json)
			if isinstance(create_book_response, Book):
				book = create_book_response
			else:
				return create_book_response
		
		try:
			new_entry = ListEntry(list_type=list_type)
			new_entry.user = User.query.filter_by(id=user_id).first()
			new_entry.book = book
			db.session.add(new_entry)
			db.session.commit()
			return success_response(ListEntrySchema().dump(new_entry))
		except IntegrityError as e:
			db.session.rollback()
			return error_response('Database constraint violation', 422)