import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
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

users = []


@app.route("/")
def index():
    return render_template('index.html')


@socketio.on('new-user')
def welcome_bdc(data):
    new_user = data['new-user']
    # users.append(new_user) how to change the username later? should i use session?
    emit('welcome-bdc', {'new_user': new_user}, broadcast=True)
    print(f'emit-welcome-bdc for {new_user}')


@socketio.on('user-rename')
def rename_bdc(data):
    payload = {
        'previous_username': data['previous-username'],
        'new_username': data['new-username']
    }
    emit('user-rename-bdc', payload, broadcast=True)
    print(f'emit-rename-bdc for {data["new-username"]}')
