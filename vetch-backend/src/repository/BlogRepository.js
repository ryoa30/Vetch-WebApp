const BaseRepository = require("./BaseRepository");

class BlogRepository extends BaseRepository {
  constructor() {
    super("Blog");
  }

  async findBlogsPagination(page = 0, volume = 10, query = "") {
    const offset = (page - 1) * volume;
    const q = query?.trim();

    const where = {
        isDeleted: false,
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    }

    const rows = await this._model.findMany({
      skip: offset,
      take: volume,
      orderBy: { date: "desc" },
      where,
      select:{
        id: true,
        title: true,
        picture: true,
        date: true,
        category: { select: { id: true, categoryName: true } },
      }
    });

    const blogs = rows.map(({ category, ...rest }) => ({
    ...rest,
    categoryId: category?.id ?? null,
    categoryName: category?.categoryName ?? null,
    }));

    const total = await this._model.count({where});

    const totalPages = total === 0 ? 0 : Math.ceil(total / volume);

    return { blogs, totalPages, totalItems: total };
  }
}

module.exports = BlogRepository;
