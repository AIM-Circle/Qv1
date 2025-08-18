from app import app

# This is the WSGI application that Gunicorn will use
application = app

if __name__ == "__main__":
    app.run()
