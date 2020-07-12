class USER:
    def __init__(self, username, channel=None):
        self.username = username
        self.channel = channel
        try:
            USER_MANAGER.add(self)
            print(f'== User created: {self.__repr__()} ==')
        except ValueError:
            print(f'Oh no. {self.username} exists, choose another one.')
        # USER.users.append(self)

    def __repr__(self):
        return f'user: {self.username}, channel: {self.channel}'


class USER_MANAGER:
    current_users = set()

    def add(user):
        if user.username in [u.username for u in USER_MANAGER.current_users]:
            raise ValueError('Duplicated username.')
        else:
            USER_MANAGER.current_users.add(user)


a = USER('user_a')
b = USER('user_a')
print(USER_MANAGER.current_users)
