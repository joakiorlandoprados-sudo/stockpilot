const Category = require("../models/Category");
const Product = require("../models/Product");
const { sendSuccess } = require("../utils/apiResponse");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });

    return sendSuccess(res, { data: categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, active: true });

    if (!category) {
      const error = new Error("Categoria no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const products = await Product.find({ category: category._id, active: true }).sort({ name: 1 });

    return sendSuccess(res, {
      data: {
        category,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description,
      active: req.body.active
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Categoria creada correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, active: true });

    if (!category) {
      const error = new Error("Categoria no encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (req.body.name !== undefined) category.name = req.body.name;
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.active !== undefined) category.active = req.body.active;

    await category.save();

    return sendSuccess(res, {
      message: "Categoria actualizada correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, active: true });

    if (!category) {
      const error = new Error("Categoria no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const relatedProducts = await Product.countDocuments({ category: category._id });
    if (relatedProducts > 0) {
      const error = new Error("No se puede eliminar una categoria con productos asociados");
      error.statusCode = 409;
      throw error;
    }

    category.active = false;
    await category.save();

    return sendSuccess(res, {
      message: "Categoria eliminada correctamente",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
