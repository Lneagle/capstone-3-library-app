# MyLibrary
MyLibrary provides a convenient place to search for books and keep track of both past and future reads.

<img width="1509" height="902" alt="search_page" src="https://github.com/user-attachments/assets/f78765a0-ac9a-4c49-afdf-5274d00627c0" />
Search page <br />
<br />
<img width="1509" height="902" alt="want-to-read" src="https://github.com/user-attachments/assets/62e0b4ab-6701-464e-a33e-1ed00dc3cba6" />
"Want to Read" list <br />
<br />  
<img width="1509" height="902" alt="details" src="https://github.com/user-attachments/assets/50f7ed00-611f-4bb0-9f8b-62c232bab178" />
Book details

## Installation
**Set up your database**  
Ensure that you have a database set up (using sqlite, postgres, or similar).  Store the database URI in a variable named 'SQLALCHEMY_DATABASE_URI' in your .env file.

**Use pipenv to install required packages**  
Enter the server directory and run the following:
```bash
pipenv install
pipenv shell
```

**Configure the `FLASK_APP` and `FLASK_RUN_PORT` environment variables**  
Note: the frontend configuration specifies port 5555 for the backend.  If you are running the server on another port, you will need to update `vite.config.js`
```bash
export FLASK_APP=app.py
export FLASK_RUN_PORT=5555
```

**Add a .env file to your root directory with your JWT secret key (along with the database URI variable above):**
```python
JWT_SECRET_KEY="your-secret-key-here"
```

**Initialize the database**
```bash
flask db upgrade head
```

**Run `python app.py` from the `server` directory**

**Change into the `frontend` directory and use `npm` to install and run the frontend code:**
```bash
npm install
npm start
```
 
## Future Considerations
Possible upgrades include book suggestions based on the entries in users' lists.
