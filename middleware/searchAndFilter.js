module.exports = {
  
  async searchAndFilter(req, res, next) {
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length) {
      dbQueries = [];
      let { couponSearch, offerType, filter,homeField } = req.query;

      if (couponSearch) {
        couponSearch = new RegExp(escapeRegExp(couponSearch), 'gi');

        dbQueries.push({
          $or: [{ searchKeyWords: couponSearch }]
        });
      }

      if (filter) {
        filter = filter.map(filter => {
          return new RegExp(escapeRegExp(filter), 'gi');
        });

        dbQueries.push({ searchKeyWords: { $in: filter } });
      }

      if (offerType) {
        dbQueries.push({ offerType });
      }

      if (homeField) {
        dbQueries.push({ homeField });
      }

      if (req.session.city) {
        const { city } = req.session;

        dbQueries.push({ city });
      }
    }
    dbQueries.push({ quantity: { $gt: 0 } });
    dbQueries.push({ isApproved: true });
    dbQueries.push({expireDate:{$gt:Date.now()}})

    res.locals.dbQueries = dbQueries.length ? { $and: dbQueries } : {};
    res.locals.query = req.query;

    //for pagination
    if (queryKeys.includes('page'))
      queryKeys.splice(queryKeys.indexOf('page'), 1);

    const delimiter = queryKeys.length ? '&' : '?';
    res.locals.paginateUrl =
      req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

    next();
  },

  async costumerSearch(req, res, next) {
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length) {
      dbQueries = [];
      let { costumerSearch } = req.query;

      if (costumerSearch) {
        costumerSearch = new RegExp(escapeRegExp(costumerSearch), 'gi');
        dbQueries.push({
          $or: [
            { username: costumerSearch },
            { email: costumerSearch },
            { number: costumerSearch }
          ]
        });
      }

      res.locals.dbQueries = dbQueries.length ? { $and: dbQueries } : {};
    }

    next();
  }
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
