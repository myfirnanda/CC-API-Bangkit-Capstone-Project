exports.get404 = (req, res) => {
  try {
    return res.status(404).json({
      success: false,
      message: 'Error 404 Page',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
