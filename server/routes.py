from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from config import db, jwt, app
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
	book_cover = book_obj['cover_image']
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
			if not author['name'] or not author['olid']:
				return error_response('Author name and olid are required for each author', 400)
			new_book.authors.append(create_or_return_author(author))
		db.session.add(new_book)
		db.session.commit()
		return new_book
	except IntegrityError as e:
		db.session.rollback()
		return error_response('Database constraint violation', 422)
	
@app.before_request
def check_if_logged_in():
	open_access_list = [
		'/signup',
		'/login'
	]
	print(request.endpoint)
	if (request.endpoint) not in open_access_list and (not verify_jwt_in_request()):
		print(request.headers)
		print(verify_jwt_in_request())
		return error_response('Unauthorized', 401)
	
class Login(Resource):
	def post(self):
		request_json = request.get_json()

		username = request_json.get('username')
		password = request_json.get('password')

		user = User.query.filter(User.name == username).first()

		if user and user.authenticate(password):
			token = create_access_token(identity=str(user.id))
			return make_response(jsonify(token=token, user=UserSchema(exclude=('list_entries',)).dump(user)), 200)

		return error_response('Username or password incorrect', 401)
	
class Signup(Resource):
	def post(self):
		request_json = request.get_json()

		username = request_json.get('username')
		password = request_json.get('password')

		user = User(name=username)
		user.password_hash = password

		try:
			db.session.add(user)
			db.session.commit()
			access_token = create_access_token(identity=str(user.id))
			return make_response(jsonify(token=access_token, user=UserSchema(exclude=('list_entries',)).dump(user)), 201)
		except IntegrityError:
			return error_response('Database constraint violation', 422)
		
class WhoAmI(Resource):
	def get(self):
		user_id = get_jwt_identity()

		user = User.query.filter_by(id=user_id).first()
		return success_response(UserSchema(exclude=('list_entries',)).dump(user))

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
		if list_type not in ['have-read', 'want-to-read']:
			return error_response('List type must be "have-read" or "want-to-read"', 400)
		
		current_user = get_jwt_identity()
		if user_id != current_user:
			return error_response('Forbidden', 403)
		
		list_entries = ListEntry.query.filter_by(user_id=user_id, list_type=list_type).all()

		if not list_entries:
			return error_response('No entries found', 404)

		return success_response([ListEntrySchema().dump(entry) for entry in list_entries])
	
	def post(self, user_id, list_type):
		if list_type not in ['have-read', 'want-to-read']:
			return error_response('List type must be "have-read" or "want-to-read"', 400)
		
		current_user = get_jwt_identity()
		if user_id != current_user:
			return error_response('Forbidden', 403)

		request_json = request.get_json()

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
		else:
			already_exists = ListEntry.query.filter_by(user_id = user_id, book_id=book.id).first()
			if already_exists:
				return error_response('List entry already exists', 409)
		
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
		
class ListEntryById(Resource):
	def patch(self, user_id, list_type, entry_id):
		request_json = request.get_json()

		if list_type not in ['have-read', 'want-to-read']:
			return error_response('List type must be "have-read" or "want-to-read"', 400)

		if not request_json:
			return error_response('Request body required', 400)
		
		list_entry = ListEntry.query.filter_by(id=entry_id).first()

		if not list_entry:
			return error_response('List entry not found', 404)

		if list_entry.user_id != user_id:
			return error_response('User not authorized to view this entry', 403)
		
		allowed_attrs = ['list_type', 'notes']

		try:
			for attr in request_json:
				if attr not in allowed_attrs:
					return error_response(f'Cannot update {attr}', 403)
				setattr(list_entry, attr, request_json[attr])
			db.session.commit()
			return success_response(ListEntrySchema().dump(list_entry))
		except IntegrityError as e:
			db.session.rollback()
			return error_response('Database constraint violation', 422)
		
	def delete(self, user_id, list_type, entry_id):
		if list_type not in ['have-read', 'want-to-read']:
			return error_response('List type must be "have-read" or "want-to-read"', 400)
		
		list_entry = ListEntry.query.filter_by(id=entry_id).first()

		if not list_entry:
			return error_response('List entry not found', 404)
		
		if list_entry.user_id != user_id:
			return error_response('User not authorized to delete this entry', 403)

		try:
			db.session.delete(list_entry)
			db.session.commit()
			return success_response(None, 204)
		except IntegrityError as e:
			db.session.rollback()
			return error_response('Database constraint violation', 422)