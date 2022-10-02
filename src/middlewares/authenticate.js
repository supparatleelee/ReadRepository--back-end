const AppError = require('../utility/appError');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new AppError('unauthenticated', 401);
    }

    const token = authorization.split(' ')[1]; //refer to the value in the first position
    if (!token) {
      throw new AppError('unauthenticated', 401);
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || 'secret_key'
    );

    const user = await User.findOne({
      where: { id: payload.id },
      attributes: { exclude: 'password' },
    });
    if (!user) {
      throw new AppError('unauthenticated', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
