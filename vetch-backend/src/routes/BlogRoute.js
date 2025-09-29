const express = require('express');
const router = express.Router();
const BlogController = require('../controller/BlogController');
const upload = require("../utils/multer");

const blogController = new BlogController();

router.get('/categories', blogController.getBlogCategories);

router.put('/', upload.single("file"), blogController.updateBlog);
router.post('/', upload.single("file"), blogController.createBlog);

router.get('/', blogController.getAllBlogs);

router.get('/:id', blogController.getBlogById);

router.delete('/:id', blogController.deleteBlog);

module.exports = router;