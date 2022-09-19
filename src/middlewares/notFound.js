module.exports = (req, res, next) => {
  res.status(404).json({ msg: 'Resource not found on this server' });
};
