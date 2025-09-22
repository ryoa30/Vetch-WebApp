const BaseRepository = require("./BaseRepository");

class RatingRepository extends BaseRepository {
  constructor() {
    super("Rating");
  }

  async getAverageRatingVets(vetIds) {
    const ratingAgg = await this._model.groupBy({
      by: ["vetId"],
      where: { vetId: { in: vetIds } },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return ratingAgg;
  }

  async getAverageRatingVet(vetId){
    const ratingAgg = await this._model.groupBy({
      by: ["vetId"],
      where: { vetId: vetId },
      _avg: { rating: true },
      _count: { _all: true },
    })

    return ratingAgg
  }

  async getVetRatings(vetId){
    const rows = await this._model.findMany({
        where: {
            vetId: vetId
        },
        orderBy: {
            ratingDate: "desc"
        },
        select:{
            id: true,
            userId: true,
            context: true,
            rating: true,
            ratingDate: true,
            user: {
                select:{
                    fullName: true
                }
            }
        }
    })

    
    const ratings = rows.map(rating => {
        return{
            ...rating,
            ...rating.user,
            user:undefined
        }
    })
    console.log(ratings);

    return ratings;
  }
}

module.exports = RatingRepository;
