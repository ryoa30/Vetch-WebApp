const BaseRepository = require('./BaseRepository');

class ConcernDetailRepository extends BaseRepository {
    constructor() {
        super('ConcernDetail');
    }

}

module.exports = ConcernDetailRepository