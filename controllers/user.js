const utils = require("../helpers/utils");
const User = require("../models/user"); // db schema

// add new user method
const addUser = async (request, reply) => {
  try {
    const userBody = request.body;

    // Construct fullName
    userBody.fullName = utils.getFullName(
      userBody.firstName,
      userBody.lastName
    );

    // delete firstName and lastName since we have the full name contains both of them
    delete userBody.firstName;
    delete userBody.lastName;

    // create new user and save in db
    const user = new User(userBody);
    const addedUser = await user.save();

    return addedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

// get all users method
const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get single user by id 

const getSingleUser = async (request, reply) => {
  try {
    const userId = request.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete user by id 
const deleteUser = async (request, reply) => {
  try {
    const userId = request.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return `${deletedUser.fullName} deleted successfully`;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addUser,
  getUsers,
  getSingleUser,
  deleteUser,
};

// getUsers
// getSingleUser
// deleteUser

// bonus : validation, updateUser
