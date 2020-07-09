import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


# @app.route("/", methods=['GET', 'POST'])
# def index():
#     # sessionstoage
#     if session.get('username'):
#         return render_template('index.html', username=session['username'])
#     if request.method == 'POST':
#         username = request.form.get('username')
#         session['username'] = username
#         return render_template('index.html', username=session['username'])
#     return render_template('index.html')


@app.route("/")
def index():
    return render_template('index.html')
