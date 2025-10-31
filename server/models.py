from sqlalchemy.orm import validates
from marshmallow import Schema, fields

from config import db, metadata

book_authors = db.Table(
	'books_authors',
	metadata,
	db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True),
	db.Column('author_id', db.Integer, db.ForeignKey('authors.id'), primary_key=True)
)

class Author(db.Model):
	__tablename__ = 'authors'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, nullable=False)
	olid = db.Column(db.String)

	books = db.relationship('Book', secondary=book_authors, back_populates='authors')

	def __repr__(self):
		return f'<Author {self.name}>'

class AuthorSchema(Schema):
	id = fields.Int()
	name = fields.String()
	olid = fields.String()

	books = fields.List(fields.Nested(lambda: BookSchema(exclude=('authors',))))

class Book(db.Model):
	__tablename__ = 'books'

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String, nullable=False)
	cover_image = db.Column(db.String)
	olid = db.Column(db.String)
	description = db.Column(db.String)
	rating = db.Column(db.Float)

	authors = db.relationship('Author', secondary=book_authors, back_populates='books')
	list_entries = db.relationship('ListEntry', back_populates='book')

	def __repr__(self):
		return f'<Book {self.title}>'

class BookSchema(Schema):
	id = fields.Int()
	title = fields.String()
	cover_image = fields.String()
	olid = fields.String()
	description = fields.String()
	rating = fields.Float()

	authors = fields.List(fields.Nested(AuthorSchema(exclude=('books',))))
	list_entries = fields.List(fields.Nested(lambda: ListEntrySchema(exclude=('book',))))

class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, nullable=False)

	list_entries = db.relationship('ListEntry', back_populates='user')

	def __repr__(self):
		return f'<User {self.name}>'

class UserSchema(Schema):
	id = fields.Int()
	name = fields.String()

	list_entries = fields.List(fields.Nested(lambda: ListEntrySchema(exclude=('user',))))

class ListEntry(db.Model):
	__tablename__ = 'list_entries'

	id = db.Column(db.Integer, primary_key=True)
	list_type = db.Column(db.String, nullable=False)
	notes = db.Column(db.String)

	book_id = db.Column(db.Integer, db.ForeignKey('books.id'))
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

	book = db.relationship('Book', back_populates='list_entries')
	user = db.relationship('User', back_populates='list_entries')

	def __repr__(self):
		return f'<ListEntry {self.list_type}: {self.book.title}'
	
class ListEntrySchema(Schema):
	id = fields.Int()
	list_type = fields.String()
	notes = fields.String()

	book = fields.Nested(BookSchema(only=('id', 'title')))
	user = fields.Nested(UserSchema(only=('id', 'name')))