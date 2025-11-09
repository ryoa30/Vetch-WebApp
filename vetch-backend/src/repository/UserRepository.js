const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super('User');
    }

    async findLastId(prefix) {
        const lastUser = await this._model.findFirst({
            where: {
                id: {
                    startsWith: prefix, 
                },
                isDeleted: false,
            },
            orderBy: {
                id: 'desc', 
            },
        });

        console.log("Last User", lastUser);
        
        if (!lastUser) {
            return 0;
        }

        const numberPart = lastUser.id.substring(prefix.length);

        return parseInt(numberPart, 10);
    }


    async findByEmail(email) {
        return this._model.findUnique({
            where: { email, isDeleted: false },
        });
    }

    async updatePasswordByEmail(email, newPassword) {
        return this._model.update({
            where: { email },
            data: { password: newPassword },
        });
    }
}

module.exports = UserRepository;