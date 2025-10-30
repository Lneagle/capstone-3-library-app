from sqlalchemy.orm import validates
from marshmallow import Schema, fields

from config import db

class Author(db.Model):
	__tablename__ = 'authors'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, nullable=False)
	olid = db.Column(db.String)

class AuthorSchema(Schema):
	id = fields.Int()
	name = fields.String()
	olid = fields.String()

""" class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, nullable=False)
	password = db.Column(db.String, nullable=False)

	list_entries = db.relationship('ListEntry', back_populates='user')

class UserSchema(Schema):
	id = fields.Int()
	name = fields.String() """