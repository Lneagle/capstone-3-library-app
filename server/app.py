#!/usr/bin/env python3

from config import app, db, api
from routes import *

api.add_resource(BookIndex, '/books', endpoint='/books')
api.add_resource(BookById, '/books/<int:id>', endpoint='/books/<int:id>')
api.add_resource(ListEntriesByList, '/users/<int:user_id>/lists/<string:list_type>/entries', endpoint='/users/<int:user_id>/lists/<string:list_type>/entries')
api.add_resource(ListEntryById, '/users/<int:user_id>/lists/<string:list_type>/entries/<int:entry_id>', endpoint='/users/<int:user_id>/lists/<string:list_type>/entries/<int:entry_id>')

if __name__ == '__main__':
  app.run(port=5555, debug=True)