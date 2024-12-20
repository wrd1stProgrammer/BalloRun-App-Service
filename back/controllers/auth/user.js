const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../../errors");
const User = require("../../models/User");
const { default: mongoose } = require("mongoose");

// Get user profile
const getProfile = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  try {

    res.status(StatusCodes.OK).json({
      user: {
        username: user.username,
        _id: user._id,
        userId: user.userId,
        email: user.email,
      }, // 임시로 4개만 뿌림.
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
};


// Update user profile
const updateProfile = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { name, bio, userImage } = req.body;

  if (!name && !bio && !userImage) {
    throw new BadRequestError("No Update Fields provided");
  }

  try {
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (userImage) user.userImage = userImage;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Profile updated successfully" });
  } catch (error) {
    throw new BadRequestError(error);
  }
};




module.exports = {
  getProfile,
  updateProfile,
};