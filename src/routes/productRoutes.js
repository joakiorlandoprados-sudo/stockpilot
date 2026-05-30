const express = require("express");
const { body, param, query } = require("express-validator");

const {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
  updateProductStock
} = require("../controllers/productController");
const { auth, authorizeRoles } = require("../middlewares/auth");
const paginate = require("../middlewares/paginate");
const validate = require("../middlewares/validate");

const router = express.Router();

const productCreateValidations = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
  body("description").optional().isString().withMessage("La descripcion debe ser un texto"),
  body("sku").trim().notEmpty().withMessage("El SKU es obligatorio"),
  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un numero mayor o igual a 0"),
  body("stock")
    .notEmpty()
    .withMessage("El stock es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un entero mayor o igual a 0"),
  body("category")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("La categoria debe ser un ID valido"),
  body("tags").optional().isArray().withMessage("Tags debe ser un arreglo"),
  body("tags.*").optional().isString().withMessage("Cada tag debe ser texto"),
  body("active").optional().isBoolean().withMessage("active debe ser booleano")
];

const productUpdateValidations = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
  body("description").optional().isString().withMessage("La descripcion debe ser un texto"),
  body("sku").optional().trim().notEmpty().withMessage("El SKU no puede estar vacio"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un numero mayor o igual a 0"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un entero mayor o igual a 0"),
  body("category")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("La categoria debe ser un ID valido"),
  body("tags").optional().isArray().withMessage("Tags debe ser un arreglo"),
  body("tags.*").optional().isString().withMessage("Cada tag debe ser texto"),
  body("active").optional().isBoolean().withMessage("active debe ser booleano")
];

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List products
 *     description: Returns a paginated list of products with filters, search, and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Regex search by name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ObjectId
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum stock
 *       - in: query
 *         name: maxStock
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum stock
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter active or inactive products
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *           example: electronics,offer
 *         description: Comma-separated tags
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, price, stock, createdAt, updatedAt]
 *         description: Sorting field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedProductsResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   post:
 *     tags: [Products]
 *     summary: Create a product
 *     description: Creates a new product. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: Mechanical Keyboard
 *             description: Compact 75% wireless keyboard
 *             sku: KEY-001
 *             price: 129.99
 *             stock: 25
 *             category: 664383f53d7f95fb678e4144
 *             tags:
 *               - electronics
 *               - offer
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Duplicate SKU
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router
  .route("/")
  .get(
    [
      query("page").optional().isInt({ min: 1 }).withMessage("page debe ser un entero positivo"),
      query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit debe estar entre 1 y 100"),
      query("search").optional().isString().withMessage("search debe ser texto"),
      query("category")
        .optional()
        .isMongoId()
        .withMessage("category debe ser un ID valido"),
      query("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("minPrice debe ser un numero mayor o igual a 0"),
      query("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("maxPrice debe ser un numero mayor o igual a 0"),
      query("minStock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("minStock debe ser un entero mayor o igual a 0"),
      query("maxStock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("maxStock debe ser un entero mayor o igual a 0"),
      query("active")
        .optional()
        .isIn(["true", "false"])
        .withMessage("active debe ser true o false"),
      query("tags").optional().isString().withMessage("tags debe ser una cadena"),
      query("sort")
        .optional()
        .isIn(["name", "price", "stock", "createdAt", "updatedAt"])
        .withMessage("sort no es valido"),
      query("order").optional().isIn(["asc", "desc"]).withMessage("order debe ser asc o desc")
    ],
    validate,
    paginate,
    listProducts
  )
  .post(auth, authorizeRoles("admin"), productCreateValidations, validate, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get one product
 *     description: Returns one active product by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid product id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   put:
 *     tags: [Products]
 *     summary: Update a product
 *     description: Updates an existing product. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Product or category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: Duplicate SKU
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   delete:
 *     tags: [Products]
 *     summary: Soft delete a product
 *     description: Marks a product as inactive. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router
  .route("/:id")
  .get([param("id").isMongoId().withMessage("ID de producto invalido")], validate, getProductById)
  .put(
    auth,
    authorizeRoles("admin"),
    [param("id").isMongoId().withMessage("ID de producto invalido"), ...productUpdateValidations],
    validate,
    updateProduct
  )
  .delete(
    auth,
    authorizeRoles("admin"),
    [param("id").isMongoId().withMessage("ID de producto invalido")],
    validate,
    deleteProduct
  );

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     tags: [Products]
 *     summary: Update only product stock
 *     description: Updates the stock field of an active product. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockUpdateInput'
 *           example:
 *             stock: 42
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch(
  "/:id/stock",
  auth,
  authorizeRoles("admin"),
  [
    param("id").isMongoId().withMessage("ID de producto invalido"),
    body("stock")
      .notEmpty()
      .withMessage("El stock es obligatorio")
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un entero mayor o igual a 0")
  ],
  validate,
  updateProductStock
);

module.exports = router;
