const slidersController = {};
const Sliders = require("../models/sliders.model");
const fs = require("fs");
const cloudinary = require("../cloudinary");
const bodyParser = require("body-parser");

slidersController.getAll = async (req, res) => {
  try {
    let sliders = await Sliders.paginate(
      {},
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: sliders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

slidersController.addSlider = async (req, res) => {
  console.log("aaa");
  try {
    const body = req.body;
    const urls = [];
    const uploader = async (path) => await cloudinary.uploads(path, "Images");
    const files = req.files;
    for (const file of files) {
      const imagepath = file.path;
      const newPath = await uploader(imagepath);
      urls.push(newPath);
      fs.unlinkSync(imagepath);
    }
    body.image_link1 = urls[0];
    const slider = new Sliders(body);

    const result = await slider.save();
    res.status(200).send({
      code: 200,
      message: "Slider Added Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Slider Added Successfully", error });
  }
};
// Delete Methods
slidersController.deleteSlider = async (req, res) => {
  const _id = req.params._id;

  if (!_id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  } else {
    Slider.findByIdAndDelete(_id, function (err) {
      res.status(200).send({
        code: 200,
        message: "deleted Successful",
      });
    });
  }
};

module.exports = slidersController;
