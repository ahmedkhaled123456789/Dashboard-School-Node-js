//model,populate

const advancedResults = (model, populate) => {
  return async (req, res, next) => {  
    console.log(req.res);
    let TeachersQuery = model.find();
    //convert query strings to number
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const total = await model.countDocuments();
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    //populate
    if (populate) {
      TeachersQuery = TeachersQuery.populate(populate);
    }

    //Filtering/searching

    if (req.query.name) {
      TeachersQuery = TeachersQuery.find({
        name: { $regex: req.query.name, $options: "i" },
 
      });
    }

    if (req.query.status) {
      TeachersQuery = TeachersQuery.find({
        status:req.query.status 
 
      });
      console.log(req.query.status) 

    }
       
    //pagination results
    const pagination = {};
    //add next
    if (endIndex < total) {
      pagination.pageCount= Math.ceil(total / limit);
      pagination.next = {
        page: page + 1,
        limit, 
        pageCount: Math.ceil(total / limit),
      };
    }

    //add prev
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1, 
        limit,
      }; 
    } 

    // //Execute query
    const teachers = await TeachersQuery.find().skip(skip).limit(limit);

    res.results = {
      total,
      pagination,
      results: teachers.length,
      status: "success",
      message: "Teachers fetched successfully",
      data: teachers,
    };

    next();
  };
};

module.exports = advancedResults;
