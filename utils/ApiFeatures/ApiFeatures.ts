class ApiFeatures {
  query: any;
  queryObj: any;

  constructor(query: any, queryObj: any) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    let queryCln = { ...this.query };
    const fields = ["sort", "limit", "page", "fields"];

    fields.forEach((el) => {
      delete queryCln[el];
    });

    queryCln = JSON.parse(
      JSON.stringify(
        queryCln.replace(
          /\b(gt|gte|lt|lte)\b/gi,
          (match: string) => `$${match}`,
        ),
      ),
    );

    this.query = this.query.find(queryCln);

    return this;
  }

  sort() {
    if (this.queryObj.sort)
      this.query = this.query.sort(this.queryObj.sort.split(",").join(" "));
    else this.query = this.query.sort("-createdAt");

    return this;
  }

  fields() {
    if (this.queryObj.fields)
      this.query = this.query.select(this.queryObj.fields);
    else this.query = this.query.select(`-__v -updatedAt -password`);

    return this;
  }

  paginate() {
    const page = this.queryObj.page || 1;
    const limit = this.queryObj.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;
