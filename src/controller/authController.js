const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utility/appError');
const { User } = require('../models');

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || 'secret_key', {
    expiresIn: process.env.JWT_EXPIRES || '1d',
  });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    //validate
    if (!firstName) {
      throw new AppError('Your first name is required', 400);
    }
    if (!lastName) {
      throw new AppError('Your last name is required', 400);
    }
    if (!email) {
      throw new AppError('Your email is required', 400);
    }
    if (!password) {
      throw new AppError('Your password name is required', 400);
    }

    const isEmail = validator.isEmail(email + '');

    if (!isEmail) {
      throw new AppError('emaill address is invalid format', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? email : null,
      password: hashedPassword,
    });

    const token = genToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isEmail = validator.isEmail(email + '');

    if (!isEmail) {
      throw new AppError('emaill address is invalid format', 400);
    }

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new AppError('email or password is invalid', 400);
    }

    const isCorrect = await bcrypt.compare(password, user.password); // true / false

    if (!isCorrect) {
      throw new AppError('email or password is invalid', 400);
    }

    const token = genToken({ id: user.id });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};
