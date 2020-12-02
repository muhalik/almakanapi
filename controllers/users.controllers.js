const usersController = {};
const Users = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");


//Post Methods
usersController.loginUser = async (req, res) => {
  try {
    const body = req.body;
    const mobile = body.mobile;
    // lets check if email exists
    const result = await Users.findOne({ mobile: mobile });
    if (!result) {
      // this means result is null
      res.status(401).send({
        message: "This user doesnot exists. Please signup first",
        code: 401,
      });
    } else {
      // email did exist
      // so lets match password
      if (bcrypt.compareSync(body.password, result.password)) {
        // great, allow this user access
        result.password = undefined;
        const token = jsonwebtoken.sign(
          {
            data: result,
            role: "User",
          },
          process.env.JWT_KEY,
          { expiresIn: "7d" }
        );
        res.send({ message: "Successfully Logged in", token: token });
      } else {
        res
          .status(401)
          .send({ message: "Number or Password is not correct", code: 401 });
      }
    }
  } catch (ex) {
    console.log("ex", ex);
  }
};

usersController.registerUser = async (req, res) => {
  try {
    const body = req.body;

    const result = await Users.findOne({ mobile: body.mobile });
    if (result) {
      res.status(500).send({
        message: "1111 This email or mobile number has been registered already",
        code: 500,
      });
    } else {
      var datetime = new Date();
      body.entry_date = datetime;
      const password = body.password;
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      body.password = hash;
      // if (body.role === "vendor") {
      //   body.status = "disapproved";
      // } else if (body.role === "customer") {
      //   body.status = "approved";
      // }
      const user = new Users(body);
      const result1 = await user.save();
      res
        .send({
          code: 200,
          message: "Signup successfully",
        })
        .status(200);
    }
  } catch (ex) {
    if (ex.code === 11000) {
      res
        .send({
          message:
            "This email or mobile number has been registered already",
          code: 403,
        })
        .status(403);
    } else {
      res
        .send({
          message: "Error",
          detail: ex,
        })
        .status(403);
    }
  }
};

// Set avatar
// usersController.set_avatar = async (req, res) => {
//   const _id = req.params._id;
//   try {
//     const user = await Users.findOne({ _id: _id });
//     if(user.avatar){	
//     const token = user.avatar
//     const filenameToRemove = token.split("/").slice(-1)[0];
//     s3.deleteObject(
//       {
//         Bucket: "slider-images",
//         Key: filenameToRemove,
//       },
//       function (err, data) { }
//     );
// }
//     const url = req.files[0].location;
//     Users.findOneAndUpdate(
//       { _id: _id },
//       {
//         $set: { avatar: url },
//       },
//       {
//         returnNewDocument: true,
//       },
//       function (error, result) {
//         res.status(200).send({
//           code: 200,
//           message: "Sucessful",
//         });
//       }
//     );
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

//Get Methods
usersController.getAll = async (req, res) => {
  let users;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    users = await Users.paginate(
      merged,
      { password: 0 },
      {
        password: 0,
        offset: parseInt(start),
        limit: parseInt(length),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.get_user = async (req, res) => {
  let users;
  try {
    users = await Users.find({ _id: req.params._id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.check_mobile = async (req, res) => {
  let user;
  try {
    user = await Users.findOne({ mobile: req.params._mobile }, { _id: 1 });
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "This Number Does Not Exist",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Get Only admin
usersController.get_admins = async (req, res) => {
  let user;
  try {
    user = await Users.paginate(
      { role: "admin" },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Get Disapproved Vendor
usersController.get_new_vendors = async (req, res) => {
  let user;

  try {
    user = await Users.paginate(
      {
        status: "disapproved",
        role: "vendor",
      },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// // Get Only vendors details
usersController.get_vendors = async (req, res) => {
  let user;
  try {
    user = await Users.paginate(
      {
        role: "vendor",
      },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// // Get Restricted Vendor
usersController.get_restricted_vendors = async (req, res) => {
  let user;

  try {
    user = await Users.paginate(
      {
        status: "restricted",
        role: "vendor",
      },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// // Get Only customers details
usersController.get_customers = async (req, res) => {
  let user;
  try {
    user = await Users.paginate(
      {
        role: "customer",
      },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// // Get Restricted Customer
usersController.get_restricted_customers = async (req, res) => {
  let user;
  try {
    user = await Users.paginate(
      {
        status: "restricted",
        role: "customer",
      },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};



usersController.get_cart = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  let user;
  let check = [];
  const _id = req.params._id;
  try {
    user = await Users.find({ _id: _id }, { cart: 1, _id: 0 });
    for (let index = 0; index < user[0].cart.length; index++) {
      check.push(user[0].cart[index]);
    }
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: check,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

usersController.get_wishlist = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  let user;
  let check = [];
  const _id = req.params._id;
  try {
    user = await Users.find({ _id: _id }, { wish_list: 1, _id: 0 });
    for (let index = 0; index < user[0].wish_list.length; index++) {
      check.push(user[0].cart[index]);
    }
    if (user) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: check,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "does not exits",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

usersController.get_total_specific_users = async (req, res) => {
  const admins_count = await Users.countDocuments({ role: "admin" });
  const vendors_count = await Users.countDocuments({ role: "vendor" });
  const new_vendors_count = await Users.countDocuments({
    role: "vendor",
    status: "disapproved",
  });
  const restricted_vendors_count = await Users.countDocuments({
    role: "vendor",
    status: "restricted",
  });
  const customers_count = await Users.countDocuments({ role: "customer" });
  const restricted_customers_count = await Users.countDocuments({
    role: "customer",
    status: "restricted",
  });
  res.status(200).send({
    code: 200,
    message: "OK",
    admins_count,
    vendors_count,
    new_vendors_count,
    restricted_vendors_count,
    customers_count,
    restricted_customers_count,
  });
};

usersController.get_users_by_query = async (req, res) => {
  let user;
  const startdate = req.query.start_date;
  const enddate = req.query.end_date + "T23:59:59Z";

  try {
    if (req.query.field === "_id") {
      var ObjectId = mongoose.Types.ObjectId;
      let _id = 0;
      try {
        _id = new ObjectId(req.query.q);
      } catch (err) {
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: { docs: [], total: 0, pages: 0 },
        });
        return
      }

      user = await Users.paginate(
        {
          role: req.params._role,
          _id: _id,
          status: req.query.status,
          entry_date: {
            $gte: new Date(startdate),
            $lte: new Date(enddate),
          },
        },
        {
          limit: parseInt(req.query.limit),
          page: parseInt(req.query.page),
        }
      );
      if (user) {
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: user,
        });
      } else {
        res.status(500).send({
          code: 500,
          message: "Does Not Exist",
        });
      }
    } else {
      const field = req.query.field;
      const search = {};
      search[field] = req.query.q;
      search["role"] = req.params._role;
      search["status"] = req.query.status;

      search["entry_date"] = { $gte: new Date(startdate), $lte: new Date(enddate) };
      user = await Users.paginate(
        search,
        {
          limit: parseInt(req.query.limit),
          page: parseInt(req.query.page),
        }
      );
      if (user) {
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: user,
        });
      } else {
        res.status(500).send({
          code: 500,
          message: "Does Not Exist",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

// put Methods
usersController.update_status = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    Users.findOneAndUpdate(
      { _id: _id },
      {
        $set: { status: req.body.status },
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "Restricted Successfully",
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.reset_password = async (req, res) => {
  const body = req.body;
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  const password = body.password;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  body.password = hash;
  try {
    const _id = req.params._id;
    Users.findOneAndUpdate(
      { _id: _id },
      {
        $set: { password: body.password },
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.add_to_cart = async (req, res) => {
  const body = req.body;
  if (body.variation_id === "") {
    body.variation_id = undefined;
    body.index = undefined;
  }
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const user = await Users.update(
      { _id: req.params._id },
      {
        $push: { ["cart"]: body },
      }
    );
    res.status(200).send({
      code: 200,
      message: "Added",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.add_to_wishlist= async (req, res) => {
  const body = req.body;
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const user = await Users.update(
      { _id: req.params._id },
      {
        $push: { wishlist: req.query },
      }
    );
    res.status(200).send({
      code: 200,
      message: "Added",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.update_profile = async (req, res) => {
  const body = req.body;
  const _id = req.params._id;
  try {
    Users.findOneAndUpdate(
      { _id: _id },
      {
        $set: body,
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      }
    );
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Delete Methods
usersController.deleteUser = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    const result = await Users.findOneAndDelete({
      _id: _id,
    });
    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.deleteCartData = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    const obj_id = req.query.obj_id;

    const result = await Users.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        $pull: { cart: { _id: obj_id } },
      },
      { new: true }
    );
    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.delete_wishlist_Data = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    const object_id = req.query.p_id;

    const result = await Users.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        $pull: { wishlist: { p_id: object_id } },
      },
      { new: true }
    );
    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.delete_cart = async (req, res) => {
  try {
    const _id = req.params._id;
    const result = await Users.update({ _id: _id }, { $unset: { cart: "" } });
    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
usersController.getSingleUser = async (req, res) => {
  let user;
  try {
    const _id = req.params._id;
    user = await Users.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.getNextId = async (req, res) => {
  try {
    const max_result = await Users.aggregate([
      { $group: { _id: null, max: { $max: "$id" } } },
    ]);
    let nextId;
    if (max_result.length > 0) {
      nextId = max_result[0].max + 1;
    } else {
      nextId = 1;
    }
    const iid = { id: nextId };
    var data = {
      code: 200,
      iid,
    };
    res.status(200).send(data);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.uploadAvatar = async (req, res) => {
  try {
    const filePath = `images/avatar/avatar-${req.params.id}`;
    const ext = path.extname(req.file.originalname);
    const updates = {
      avatar: filePath,
      avatar_ext: ext,
    };
    runUpdateById(req.params.id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.updateUser = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Users.updateOne(
      {
        _id: _id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: "Created Successfully",
        });
      } else {
        res.status(422).send({
          code: 422,
          message: "Unprocessible Entity",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}

async function runUpdateById(id, updates, res) {
  try {
    const result = await Users.updateOne(
      {
        id: id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    if (result.nModified == 1) {
      res.status(200).send({
        code: 200,
        message: "Updated Successfully",
      });
    } else if (result.upserted) {
      res.status(200).send({
        code: 200,
        message: "Created Successfully",
      });
    } else {
      {
        res.status(200).send({
          code: 200,
          message: "Task completed successfully",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}

module.exports = usersController;

// const user = new Users ({
//   _id: new mongoose.Types.ObjectId(),
//   name: req.body.name,
//   number: req.body.number,
// });
// user.save().then(result => {
//   res.send({
//     message: 'Signup successful'
//   });
// }).catch(err => {
//   res
//       .send({
//         message: 'This email has been registered already',
//       })
//       .status(500);
// })










// This is old code



// const usersController = {};
// const Users = require('../models/users.model');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const jsonwebtoken = require('jsonwebtoken');

// usersController.getAll = async (req, res) => {
//   let users;
//   try {
//     let merged = {};

//     users = await Users.paginate(
//       merged,
//       { password: 0 },
//       {
//         password: 0,
//         offset: parseInt(start),
//         limit: parseInt(length)
//       }
//     );
//     res.status(200).send({
//       code: 200,
//       message: 'Successful',
//       data: users
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// usersController.getSingleUser = async (req, res) => {
//   let user;
//   try {
//     const _id = req.params._id;
//     user = await Users.findOne({ _id: _id });
//     res.status(200).send({
//       code: 200,
//       message: 'Successful',
//       data: user
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// usersController.registerUser = async (req, res) => {
//   try {
//     const body = req.body;
//     // there must be a password in body
//     // we follow these 2 steps
//     const password = body.password;
//     var salt = bcrypt.genSaltSync(10);
//     var hash = bcrypt.hashSync(password, salt);
//     body.password = hash;
//     const user = new Users(body);
//     const result = await user.save();
//     res.send({
//       message: 'Signup successful'
//     });
//   } catch (ex) {
//     console.log('ex', ex);
//     if (ex.code === 11000) {
//       res
//         .send({
//           message: 'This email has been registered already',
//         })
//         .status(500);
//     }
//     else {
//       res
//         .send({
//           message: 'Error',
//           detail: ex
//         })
//         .status(500);
//     }
//   }
// };


// usersController.loginUser = async (req, res) => {
//   try {
//     const body = req.body;
//     const email = body.email;
//     // lets check if email exists
//     const result = await Users.findOne({ email: email });
//     if (!result) {
//       // this means result is null
//       res.status(401).send({
//         message: 'This user doesnot exists. Please signup first'
//       });
//     } else {
//       // email did exist
//       // so lets match password
//       if (bcrypt.compareSync(body.password, result.password)) {
//         // great, allow this user access
//         result.password = undefined;
//         const token = jsonwebtoken.sign({
//           data: result,
//           role: 'User'
//         }, process.env.JWT_KEY, { expiresIn: '7d' });
//         res.send({ message: 'Successfully Logged in', token: token });
//       }
//       else {
//         console.log('password doesnot match');
//         res.status(401).send({ message: 'Wrong email or Password' });
//       }
//     }
//   } catch (ex) {
//     console.log('ex', ex);
//   }
// };

// usersController.getNextId = async (req, res) => {
//   try {
//     const max_result = await Users.aggregate([
//       { $group: { _id: null, max: { $max: '$id' } } }
//     ]);
//     let nextId;
//     if (max_result.length > 0) {
//       nextId = max_result[0].max + 1;
//     } else {
//       nextId = 1;
//     }
//     var data = {
//       code: 200,
//       data: { id: nextId }
//     };
//     res.status(200).send(data);
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// usersController.deleteUser = async (req, res) => {
//   if (!req.params._id) {
//     Fu;
//     res.status(500).send({
//       message: 'ID missing'
//     });
//   }
//   try {
//     const _id = req.params._id;
//     const result = await Users.findOneAndDelete({
//       _id: _id
//     });
//     //   const result = await Inventory.updateOne({
//     //         _id: _id
//     //     }, {
//     //         $set: {is_deleted: 1}
//     //     }, {
//     //         upsert: true,
//     //         runValidators: true
//     //     });
//     res.status(200).send({
//       code: 200,
//       message: 'Deleted Successfully'
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };
// usersController.uploadAvatar = async (req, res) => {
//   try {
//     const filePath = `images/avatar/avatar-${req.params.id}`;
//     const ext = path.extname(req.file.originalname);
//     const updates = {
//       avatar: filePath,
//       avatar_ext: ext
//     };
//     runUpdateById(req.params.id, updates, res);
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// usersController.updateUser = async (req, res) => {
//   if (!req.params._id) {
//     res.status(500).send({
//       message: 'ID missing'
//     });
//   }
//   try {
//     const _id = req.params._id;
//     let updates = req.body;
//     runUpdate(_id, updates, res);
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// async function runUpdate(_id, updates, res) {
//   try {
//     const result = await Users.updateOne(
//       {
//         _id: _id
//       },
//       {
//         $set: updates
//       },
//       {
//         upsert: true,
//         runValidators: true
//       }
//     );

//     {
//       if (result.nModified == 1) {
//         res.status(200).send({
//           code: 200,
//           message: 'Updated Successfully'
//         });
//       } else if (result.upserted) {
//         res.status(200).send({
//           code: 200,
//           message: 'Created Successfully'
//         });
//       } else {
//         res.status(422).send({
//           code: 422,
//           message: 'Unprocessible Entity'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// }

// async function runUpdateById(id, updates, res) {
//   try {
//     const result = await Users.updateOne(
//       {
//         id: id
//       },
//       {
//         $set: updates
//       },
//       {
//         upsert: true,
//         runValidators: true
//       }
//     );

//     if (result.nModified == 1) {
//       res.status(200).send({
//         code: 200,
//         message: 'Updated Successfully'
//       });
//     } else if (result.upserted) {
//       res.status(200).send({
//         code: 200,
//         message: 'Created Successfully'
//       });
//     } else {
//       {
//         res.status(200).send({
//           code: 200,
//           message: 'Task completed successfully'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// }

// module.exports = usersController;
