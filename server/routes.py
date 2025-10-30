from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from config import db
from models import *

class AllAuthors(Resource):
	def get(self):
		authors = Author.query.all()

		return [AuthorSchema().dump(author) for author in authors], 200