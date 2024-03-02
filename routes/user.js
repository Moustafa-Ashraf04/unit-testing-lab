const { addUser, getUsers, getSingleUser, deleteUser } = require("../controllers/user");

const routes = [
    {
        method: 'POST',
        url: '/api/users',
        handler: addUser
    },
    {
        method: 'GET',
        url: '/api/users',
        handler: getUsers
    },
    {
        method: 'GET',
        url: '/api/users/:userId',
        handler: getSingleUser
    },
    {
        method: 'DELETE',
        url: '/api/users/:userId',
        handler: deleteUser
    }
];

module.exports = routes;