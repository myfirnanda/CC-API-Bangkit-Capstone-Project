exports.get404 = (req, res) => (
  res.status(400).json({
    success: false,
    message: 'Error 404 Page',
  })
);
