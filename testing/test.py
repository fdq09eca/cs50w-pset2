# class USER:
#     def __init__(self, username, channel=None):
#         self.username = username
#         self.channel = channel
#         try:
#             USER_MANAGER.add(self)
#             print(f'== User created: {self.__repr__()} ==')
#         except ValueError:
#             print(f'Oh no. {self.username} exists, choose another one.')
#         # USER.users.append(self)

#     def __repr__(self):
#         return f'user: {self.username}, channel: {self.channel}'


# class USER_MANAGER:
#     current_users = set()

#     def add(user):
#         if user.username in [u.username for u in USER_MANAGER.current_users]:
#             raise ValueError('Duplicated username.')
#         else:
#             USER_MANAGER.current_users.add(user)


# a = USER('user_a')
# b = USER('user_a')
# print(USER_MANAGER.current_users)


class USER:
    def __init__(self, username, channel=None):
        self.username = username
        self.channel = channel
        userManager.add(self)

    def rename(self, new_username):
        self.username = new_username


class userManager:
    users = []

    def add(user):
        userManager.users.append(user)
        print(f'{user.username} is added to users list')


default_username = 'untitled users'
user_a = USER(default_username)
user_b = USER(default_username)

print([u.username for u in userManager.users])
user_a.rename('chris')
print([u.username for u in userManager.users])
userManager.users = filter(
    lambda user: user.username != 'chris', userManager.users)
# for u, c in zip(userManager.users, range(len(userManager.users))):
#     if u.username == 'chris':
#         del userManager.users[c]
# print([u.username for u in userManager.users])
print(list(userManager.users)
