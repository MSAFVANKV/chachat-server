const userCollection = require("../Modal/userModal");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userNameCheck = await userCollection.findOne({ username });
    if (userNameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await userCollection.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email is already registered", status: false });
    }
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userCollection.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({
      msg: "User Registered Successfully",
      status: true,
      user,
    });
  } catch (error) {
    console.log("error in user registration", error);
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userCollection.findOne({ username });
    if (!user) {
      return res.json({ msg: "Incorrect username", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // Compare the password
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect password", status: false });
    }
    delete user.password;

    return res.json({ status: true, user }); // Fix the typo here (replace "." with ",")
  } catch (error) {
    console.log("error in user login", error);
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await userCollection.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    if (!userData) {
      // If the user data is not found, handle the error
      return res
        .status(404)
        .json({ isSet: false, image: null, msg: "User not found" });
    }

    return res.json({ isSet: true, image: userData.avatarImage });
  } catch (error) {
    console.error("Error setting avatar:", error);
    return res
      .status(500)
      .json({ isSet: false, image: null, msg: "Internal server error" });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userCollection
      .find({ _id: { $ne: req.params.id } })
      .select(["email", "username", "avatarImage", "_id"]);
      return res.json(users);
  } catch (error) {
    next(error);
  }
};
