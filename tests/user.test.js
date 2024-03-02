const it = require("ava").default;
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const startDB = require("../helpers/DB");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
  addUser,
  getUsers,
  getSingleUser,
  deleteUser,
} = require("../controllers/user");
const utils = require("../helpers/utils");
const User = require("../models/user");

// create new testing  mongodb
it.before(async (t) => {
  t.context.mongod = await MongoMemoryServer.create();
  process.env.MONGOURI = t.context.mongod.getUri("itiUnitTesting");
  await startDB();
});

// cleanup testing mongodb after the test
it.after(async (t) => {
  await t.context.mongod.stop({ doCleanUp: true });
});

// positive case for adding new user
it("should create one user", async (t) => {
  // setup
  const fullName = "menna hamdy";
  const request = {
    body: {
      firstName: "menna",
      lastName: "hamdy",
      age: 25,
      job: "developer",
    },
  };

  expectedResult = {
    fullName,
    age: 25,
    job: "developer",
  };
  // exercise
  const stub1 = sinon.stub(utils, "getFullName").callsFake((fname, lname) => {
    expect(fname).to.be.equal(request.body.firstName);
    expect(lname).to.be.equal(request.body.lastName);
    return fullName;
  });

  // deletes any documents in the User
  t.teardown(async () => {
    await User.deleteMany({
      fullName: request.body.fullName,
    });
    stub1.restore();
  });

  const actualResult = await addUser(request);
  // verify

  expect(actualResult._doc).to.deep.equal({
    _id: actualResult._id,
    __v: actualResult.__v,
    ...expectedResult,
  });

  const users = await User.find({ fullName }).lean();

  expect(users).to.have.length(1);
  expect(users[0]).to.deep.equal({
    _id: actualResult._id,
    __v: actualResult.__v,
    ...expectedResult,
  });
  t.pass();
});

// positive case for geting all users test
it("should retrieve all users", async (t) => {
  // Cleanup: Delete previous records in the database

  // Setup: Insert test users directly into the database
  const usersData = [
    {
      fullName: "Omar Ahmed",
      age: 27,
      job: "Designer",
    },
    {
      fullName: "Moustafa Ashraf",
      age: 25,
      job: "Developer",
    },
  ];
  await User.insertMany(usersData);

  // Exercise: Retrieve all users from the database
  const actualUsers = await getUsers();

  // Verify: Check the number of users returned
  expect(actualUsers).to.have.lengthOf(12);
  t.pass();
});

// positive case for getting a single user by id
it("should retrieve a single user by ID", async (t) => {
  // setup
  const user = new User({
    fullName: "Mahmoud Ahmed",
    age: 29,
    job: "Engineer",
  });
  await user.save();

  // exercise
  const userId = user._id.toString();
  const actualUser = await getSingleUser({ params: { userId } });

  // verify
  expect(actualUser).to.exist;
  expect(actualUser.fullName).to.equal("Mahmoud Ahmed");
  t.pass();
});

// positive case for deleting a single user by id
it("should delete a user by ID", async (t) => {
  // setup
  const user = new User({
    fullName: "Khaled Ali",
    age: 22,
    job: "Developer",
  });
  await user.save();

  // exercise
  const userId = user._id.toString();
  const deletedUser = await deleteUser({ params: { userId } });

  // verify
  expect(deletedUser).to.exist;
  expect(deletedUser).to.equal(`${user.fullName} deleted successfully`);
  const userCheck = await User.findById(userId);
  expect(userCheck).to.not.exist;
  t.pass();
});

// Negative case for deleting a user with no id provided
it("should throw an error if user ID is not provided", async (t) => {
  // setup
  const invalidUserId = "";

  // exercise and verify
  await t.throwsAsync(async () => {
    await deleteUser({ params: { userId: invalidUserId } });
  });
  t.pass();
});

// Negative case for deleting a user doesn't exist

it("should throw an error if user does not exist", async (t) => {
  // setup
  const nonExistentUserId = "nonexistentuserid"; // Non-existent user ID

  // exercise and verify
  await t.throwsAsync(async () => {
    await deleteUser({ params: { userId: nonExistentUserId } });
  });
  t.pass();
});
