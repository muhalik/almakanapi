const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const Product = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
  },
  building_name: {
    type: String,
  },
  city: {
    type: String,
  },
  description: {
    type: String,
  },
  flat_per_floor: {
    type: String,
  },
  floors: {
    type: String,
  },
  four_bed_length: {
    type: String,
  },
  four_bed_width: {
    type: String,
  },
  four_bed_price: {
    type: String,
  },
  three_bed_length: {
    type: String,
  },
  three_bed_width: {
    type: String,
  },
  three_bed_price: {
    type: String,
  },
  
  two_bed_length: {
    type: String,
  },
  two_bed_width: {
    type: String,
  },
  two_bed_price: {
    type: String,
  },
  location: {
    type: String,
  },
  variations: [
    {
      floor_no: { type: String },
      flats: [
        {
          bed_type: { type: String },
          flat_no: { type: String },
        },
      ],
    },
  ],

  image_link1: [
    {
      url: { type: String },
    },
  ],
  image_link2: [
    {
      url: { type: String },
    },
  ],
  image_link3: [
    {
      url: { type: String },
    },
  ],

  reviews: [
    {
      c_name: { type: String },
      review: { type: String },
      entry_date: { type: Date },
    },
  ],

  entry_date: {
    type: Date,
  },

});

Product.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", Product);

// Before
// const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate');
// const Schema = mongoose.Schema;

// const Product = new Schema({
//     name: {
//         type: String
//     },
//     size: {
//         type: String
//     },
//     quantity: {
//         type: String,
//         unique: true,
//         sparse: true
//     },
//     category: {
//         type: String
//     },
//     address: {
//         type: String
//     },
//     // image: {
//     //     data: Buffer,
//     //     contentType: String
//     // },
//     is_deleted: {
//         type: Boolean,
//         default: false
//     }
// });

// Product.plugin(mongoosePaginate);

// module.exports = mongoose.model("Product", Product);
