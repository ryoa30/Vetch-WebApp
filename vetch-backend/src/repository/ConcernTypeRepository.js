const BaseRepository = require('./BaseRepository');

class ConcernTypeRepository extends BaseRepository {
    constructor() {
        super('ConcernType');
    }

}

module.exports = ConcernTypeRepository;