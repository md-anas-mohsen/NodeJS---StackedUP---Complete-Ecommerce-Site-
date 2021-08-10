class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: "i"
            }
        }:{}

        this.query = this.query.find({...keyword})
        return this;
    }

    filter() {
        const queryCopy = {...this.queryString};
        const removeFields = ["keyword", "limit", "page"]; 
        removeFields.forEach(elem => delete queryCopy[elem]);

        //Filtering by price range
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultsPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const toSkip = resultsPerPage * (currentPage-1);
        this.query = this.query.limit(resultsPerPage).skip(toSkip);
        return this;
    }
}

module.exports = APIFeatures;