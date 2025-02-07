const profileController = {};

profileController.list = (req, res) => {
  return res.send("Profile list api");
};

module.exports = profileController;
