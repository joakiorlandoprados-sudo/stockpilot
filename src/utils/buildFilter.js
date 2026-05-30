const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildProductFilter = (query = {}) => {
  const filter = {};
  const allowedSortFields = ["name", "price", "stock", "createdAt", "updatedAt"];

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } }
    ];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.active === "true") {
    filter.active = true;
  }

  if (query.active === "false") {
    filter.active = false;
  }

  if (query.tags) {
    const tags = query.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }
  }

  const minPrice = parseNumber(query.minPrice);
  const maxPrice = parseNumber(query.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice;
    }
  }

  const minStock = parseNumber(query.minStock);
  const maxStock = parseNumber(query.maxStock);
  if (minStock !== undefined || maxStock !== undefined) {
    filter.stock = {};

    if (minStock !== undefined) {
      filter.stock.$gte = minStock;
    }

    if (maxStock !== undefined) {
      filter.stock.$lte = maxStock;
    }
  }

  const sortField = allowedSortFields.includes(query.sort) ? query.sort : "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;

  return {
    filter,
    sort: {
      [sortField]: sortOrder
    }
  };
};

module.exports = buildProductFilter;
