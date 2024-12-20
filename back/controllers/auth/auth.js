const User = require("../../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors");
const jwt = require("jsonwebtoken");


const refreshToken = async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw new BadRequestError("Refresh token is required");
    }
  
    try {
      const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(payload.userId);
  
      if (!user) {
        throw new UnauthenticatedError("Invalid refresh token");
      }
  
      const newAccessToken = user.createAccessToken();
      const newRefreshToken = user.createRefreshToken();
  
      res.status(StatusCodes.OK).json({
        tokens: { access_token: newAccessToken, refresh_token: newRefreshToken },
      });
    } catch (error) {
      console.error(error);
      throw new UnauthenticatedError("Invalid refresh token");
    }
  };

  module.exports = {
    refreshToken,
  };