#!/usr/bin/env python3

from config import app, db, api
from routes import *

api.add_resource(AllAuthors, '/authors', endpoint='/authors')

if __name__ == '__main__':
  app.run(port=5555, debug=True)