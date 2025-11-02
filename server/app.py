#!/usr/bin/env python3

from config import app, db, api
from routes import *

api.add_resource(BookIndex, '/books', endpoint='/books')

if __name__ == '__main__':
  app.run(port=5555, debug=True)