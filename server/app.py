#!/usr/bin/env python3

from config import app, db, api
from routes import *

api.add_resource(BookIndex, '/books', endpoint='/books')
api.add_resource(BookById, '/books/<int:id>', endpoint='/books/<int:id>')
api.add_resource(ListEntriesByList, '/users/<int:user_id>/lists/<string:list_type>', endpoint='/users/<int:user_id>/lists/<string:list_type>')

if __name__ == '__main__':
  app.run(port=5555, debug=True)