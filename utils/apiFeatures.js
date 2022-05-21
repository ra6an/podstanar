class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const copyQuery = { ...this.queryObj };
    const excludedFields = ["fields", "limit", "sort", "page"];
    excludedFields.forEach((key) => delete copyQuery[key]);

    let queryStringified = JSON.stringify(copyQuery);

    queryStringified.replace(/\b(gte|gt|lte|lt)\b/, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStringified));
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagginate() {
    const page = this.queryObj.page || 1;
    const limit = this.queryObj.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
