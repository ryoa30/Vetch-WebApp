const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

class BaseRepository {
    _model;

    constructor(modelName) {
        if (!prisma[modelName]) {
            throw new Error(`Model "${modelName}" does not exist on the Prisma client.`);
        }
        this._model = prisma[modelName];
    }

    async create(data) {
        return this._model.create({ data });
    }

    async findById(id, options = {}) {
        // Note: Prisma IDs are often strings, but we parse to be safe if you use integers.
        return this._model.findUnique({
            where: { id: id, isDeleted: false },
            ...options,
        });
    }

    async findAll(options = {}) {
        return this._model.findMany(options);
    }

    async update(id, data) {
        return this._model.update({
            where: { id: id },
            data,
        });
    }

    async delete(id) {
        return this._model.delete({
            where: { id: id },
        });
    }

    async softDelete(id){
        return this._model.update({
            where: { id: id },
            data: { isDeleted: true },
        });
    }
}

module.exports = BaseRepository;