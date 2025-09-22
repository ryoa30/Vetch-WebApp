const BlogRepository = require("../repository/BlogRepository");
const CategoryRepository = require("../repository/CategoryRepository");
const cloudinary = require("../utils/cloudinary");

class BlogController {
  #blogRepository;
  #categoryRepository;

  constructor() {
    this.#blogRepository = new BlogRepository();
    this.#categoryRepository = new CategoryRepository();

    this.createBlog = this.createBlog.bind(this);
    this.updateBlog = this.updateBlog.bind(this);
    this.getBlogCategories = this.getBlogCategories.bind(this);
    this.getAllBlogs = this.getAllBlogs.bind(this);
    this.getBlogById = this.getBlogById.bind(this);
    this.deleteBlog = this.deleteBlog.bind(this);
  }

  async createBlog(req, res) {
    const blog = req.body.data ? JSON.parse(req.body.data) : req.body;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-images",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        // Multer memory buffer -> upload_stream
        stream.end(req.file.buffer);
      });

      console.log("uploadResult", uploadResult);

      blog.picture = uploadResult.secure_url;
    }
    const createdBlog = await this.#blogRepository.create(blog);
    res
      .status(201)
      .json({ ok: true, message: "Blog created", data: createdBlog });
  }

  async updateBlog(req, res) {
    const blog = req.body.data ? JSON.parse(req.body.data) : req.body;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "blog-images",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        // Multer memory buffer -> upload_stream
        stream.end(req.file.buffer);
      });

      console.log("uploadResult", uploadResult);

      blog.picture = uploadResult.secure_url;
    }
    const updatedBlog = await this.#blogRepository.update(blog.id,blog);
    res
      .status(201)
      .json({ ok: true, message: "Blog created", data: updatedBlog });
  }

  async getBlogCategories(req, res) {
    const categories = await this.#categoryRepository.findAll();
    res.status(200).json({ ok: true, message: "Success", data: categories });
  }

  async getAllBlogs(req, res) {
    try {
      const { page = 1, volume = 10, query = "" } = req.query;
      const { blogs, totalPages, totalItems } =
        await this.#blogRepository.findBlogsPagination(
          parseInt(page),
          parseInt(volume),
          query
        );
      res
        .status(200)
        .json({
          ok: true,
          message: "Success",
          data: { blogs, totalPages, totalItems },
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          ok: false,
          message: "Error fetching blogs",
          error: error.message,
        });
    }
  }

  async getBlogById(req, res) {
    try {
      const { id } = req.params;
      const blog = await this.#blogRepository.findById(id, {
        include: { category: true },
      });
      if (!blog) {
        return res
          .status(404)
          .json({ ok: false, message: "Blog not found", error: "Not Found" });
      }
      res
        .status(200)
        .json({ ok: true, message: "Success get Blog By ID", data: blog });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching blog", error: error.message });
    }
  }

  async deleteBlog(req, res) {
    try {
        const { id } = req.params;
        await this.#blogRepository.softDelete(id);
        res.status(200).json({ ok: true, message: "Blog deleted" });
    } catch (error) {
        console.log(error)
        res
        .status(500)
        .json({ message: "Error Deleting blog", error: error.message });
    }
  }
}

module.exports = BlogController;
