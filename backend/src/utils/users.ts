const users:any = [];

// Join user to chat
function userJoin(id: number, username: string, room: any) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id:number) {
  return users.find((user:any) => user.id === id);
}

// User leaves chat
function userLeave(id:number) {
  const index = users.findIndex((user:any) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room:any) {
  return users.filter((user:any) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
