export default {
	
	data () {
		return {
			pagination: {}
		}
	},
	methods: {
		paginate (data) {
			if (data.length > this.options.perPage) { // requires pagination?
				return this._.slice(data, 
					this.pagination.startIndex,
					this.pagination.endIndex + 1
				);
			}
			return data;
		},
		setPage (page) {
			this.pagination = this.buildPagination(this.data.length, page, this.options.perPage);
			this.checkedItems = [];
		},
		buildPagination (totalItems, currentPage, pageSize) {	 
	        // calculate total pages
	        var totalPages = Math.ceil(totalItems / pageSize),
	 
	        // calculate start and end item indexes
			startIndex = (currentPage - 1) * pageSize,
			endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1),
			startPage, endPage;

	        if (totalPages <= 10) {
	            // less than 10 total pages so show all
	            startPage = 1;
	            endPage = totalPages;
	        } else {
	            // more than 10 total pages so calculate start and end pages
	            if (currentPage <= 6) {
	                startPage = 1;
	                endPage = 10;
	            } else if (currentPage + 4 >= totalPages) {
	                startPage = totalPages - 9;
	                endPage = totalPages;
	            } else {
	                startPage = currentPage - 5;
	                endPage = currentPage + 4;
	            }
	        }

	        // create an array of pages to ng-repeat in the pager control
			var pages = this._.range(startPage, endPage + 1);
	 
	        // return object with all pager properties required by the view
	        return {
	            totalItems: totalItems,
	            currentPage: currentPage,
	            pageSize: pageSize,
	            totalPages: totalPages,
	            startPage: startPage,
	            endPage: endPage,
	            startIndex: startIndex,
	            endIndex: endIndex,
	            pages: pages
	        };
		}
	},
	created () {
		this.setPage(1);
	}
}