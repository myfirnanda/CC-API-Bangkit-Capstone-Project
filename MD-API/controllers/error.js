exports.get404 = (req, res) => {
  return res.status(400).json({
    success: false,
    message: 'Error 404 Page',
  });
};
