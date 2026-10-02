//model,populate
// Optional `req.filter` (set by a previous middleware) scopes the query,
// e.g. a teacher only sees his own exams.

const advancedResults = (model, populate, select = "-password") => {
  return async (req, res, next) => {
    try {
      //Filtering/searching
      const filter = { ...(req.filter || {}) };

      if (req.query.name) {
        filter.name = { $regex: req.query.name, $options: "i" };
      }

      if (req.query.status) {
        filter.status = req.query.status;
      }

      //convert query strings to number
      //no limit => return every document (dropdowns need the full list)
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Number(req.query.limit) || 0;
      const skip = limit ? (page - 1) * limit : 0;

      const total = await model.countDocuments(filter);

      let query = model.find(filter).select(select).sort("-createdAt");
      //populate
      if (populate) {
        query = query.populate(populate);
      }
      if (limit) {
        query = query.skip(skip).limit(limit);
      }

      const docs = await query;

      //pagination results
      const pagination = {};
      if (limit) {
        pagination.pageCount = Math.ceil(total / limit);
        //add next
        if (page * limit < total) {
          pagination.next = { page: page + 1, limit };
        }
        //add prev
        if (skip > 0) {
          pagination.prev = { page: page - 1, limit };
        }
      }

      res.results = {
        total,
        pagination,
        next: pagination.next,
        previous: pagination.prev,
        results: docs.length,
        status: "success",
        message: "Data fetched successfully",
        data: docs,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = advancedResults;
