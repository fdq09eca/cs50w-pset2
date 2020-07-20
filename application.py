import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from datetime import datetime
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

msgs = {}

rooms = {}

class MESSAGE:
    def __init__(self, user_id, content):
        self.user = userManager.getUser(user_id)
        self.content = content
        self.room = self.user.room
        self.time = datetime.now()

    def format(self):
        # self.content.replace('\n', '==sdfsdf==')
        return f'''
        <span data-sender_id='{self.user.id}'>
        <strong>{self.user.username}</strong>
        <p>{self.content}</p>
        <small>{self.time}</small>
        </span>
        '''

    def archive(self):
        if not msgs.get(self.room):
            msgs[self.room] = []
            print('\n\n== new room history created ==\n\n')
        if len(msgs[self.room]) > 100:
            msgs[self.room].pop(0)
        msgs[self.room].append(self.format())
        print(f'\n\n== message archived! ==\n{self.content}\n\n')


class USER:
    def __init__(self, username, room=None):
        self.username = username
        self.room = room
        self.id = request.sid
        print(self)

    def __str__(self):
        return f'\n\n == Username: {self.username}, ID: {self.id} ==\n\n'


class userManager:
    users = []

    def add(user):
        userManager.users.append(user)

    def getUser(user_id):
        user = [u for u in userManager.users if u.id == user_id]
        if len(user) > 1:
            print('\n\n== user_id is not unique!! == \n\n')
            raise TypeError('getUser returns more than 1 user.')
        if len(user) == 0:
            print('\n\n== no such user!! == \n\n')
            raise TypeError('no such user!')
        return [u for u in userManager.users if u.id == user_id][0]

    def remove(user_id):
        userManager.users = [u for u in userManager.users if u.id != user_id]

    def rename(new_username, user_id):
        userManager.getUser(user_id).username = new_username


@app.route("/")
def index():
    return render_template('index.html')


@app.route('/room_log', methods=['POST'])
def get_rmlog():
    room = request.form.get('room')
    return jsonify({'roomlog': msgs.get(room)})


@socketio.on('message')
def send_msg(data):
    msg = MESSAGE(data['user-id'], data['msg'])
    send({'msg': msg.format()}, room=msg.room)
    msg.archive()


@socketio.on('user-arrived-lobby')
def welcome_bdc(data):
    username = data['username']
    user = USER(username)
    userManager.add(user)
    emit('welcome-bdc', {'msg': f'{username} is online.'}, broadcast=True)
    emit('store-user-id', {'sid': user.id}, room=user.id)
    print(f'\n\n==ARRIVAL: {username}==\nCurrent users : {[u.username for u in userManager.users]}\n\n')


@socketio.on('user-rename')
def rename_bdc(data):
    previous_username = data['previous-username']
    new_username = data['new-username']
    user_id = data['user-id']
    userManager.rename(new_username, user_id)
    msg = f'{previous_username} changed their name to {new_username}'
    emit('user-rename-bdc', {'msg': msg}, broadcast=True)


@socketio.on('user-disconnect')
def user_offline(data):
    user = userManager.getUser(data['user-id'])
    userManager.remove(data['user-id'])
    emit('disconnect-msg',
         {'msg': f'{user.username} is offline'}, broadcast=True)
    print(
        f'\n\n==REMOVE: {user.username}==\n ==Current users : {[u.username for u in userManager.users]} {len(userManager.users)}==\n\n')
    


@socketio.on('room-created')
def room_created(data):
    user = userManager.getUser(data['user-id'])
    msg = f'{user.username} created room {data["roomname"]}'
    emit('room-created-bdc',
         {
             'msg': msg,
             'user': user.username,
             'roomname': data['roomname'],
             'user-id': data['user-id'],
         }, broadcast=True)
    rooms[data['roomname']] = data['user-id']
    


@socketio.on('join')
def join(data):
    user = userManager.getUser(data['user-id'])
    room = data['roomname']
    join_room(room)
    print(f'\n\n{user.username} joined {room}\n==Current users : {[u.username for u in userManager.users]}; N-user: {len(userManager.users)} ==\n\n')
    user.room = room
    emit('get_roomlog', {'roomname': user.room}, room = user.id)
    room_list = [(_rm, _id) for _rm , _id in rooms.items()]
    emit('join_room', {
         'msg': f'{user.username} joined {room}', 'room': room}, room=room)
    if not data.get('no-refresh-rmli'):
        emit('get_roomlist', {'room_list': room_list}, room = user.id)



@socketio.on('leave')
def leave(data):
    user = userManager.getUser(data['user-id'])
    room = data['roomname']
    emit('leave_room', {'msg': f'{user.username} left {room}','roomname':room}, room=room)
    leave_room(room)
    user.room = 'lobby'
    print(f'\n\n{user.username} left {room}\n\n')
    emit('get_roomlog', {'roomname': user.room}, room = user.id)


@socketio.on('room-close')
def room_close(data):
    user = userManager.getUser(data['user-id'])
    room = data["closed-room-id"]
    msgs.pop(room, None)
    msg = f'{user.username} closed room: {room}'
    emit('closed-room-cbdc', {'msg': msg,
                              'closed-room-id': room}, room=room)
    emit('closed-room-bdc', {'msg': msg,
                             'closed-room-id': room}, broadcast=True)
    if room != 'lobby':
        rooms.pop(room, None)

if __name__ == "__main__":
    socketio.run(app)