import randtoken from "rand-token";
import jwt from "jsonwebtoken";

const secret = process.env.TOKEN_KEY;

const generateToken = (numberOfCharacters) =>
  randtoken.generate(numberOfCharacters);

const generateJWT = (user) =>
  jwt.sign({ id: user._id, managerId: user.contentManagerId }, secret, {
    expiresIn: 86400,
  });

const generateRefreshJWT = (user) =>
  jwt.sign({ id: user._id, managerId: user.contentManagerId }, secret, {
    expiresIn: 604800,
  });

module.exports = { generateToken, generateJWT, generateRefreshJWT };
