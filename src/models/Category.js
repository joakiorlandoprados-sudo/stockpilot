const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

categorySchema.pre("save", function preSave(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }

  next();
});

module.exports = mongoose.model("Category", categorySchema);
