const express = require('express');
const router = express.Router();
const BlogController = require('../controller/BlogController');
const upload = require("../utils/multer");

const blogController = new BlogController();


router.get('/categories', blogController.getBlogCategories);

router.get('/', blogController.getAllBlogs);

router.get('/:id', blogController.getBlogById);

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);
router.put('/', upload.single("file"), blogController.putBlog);
router.post('/', upload.single("file"), blogController.createBlog);


router.delete('/:id', blogController.deleteBlog);

module.exports = router;