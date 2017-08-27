var Filter = function (name, prop, handler, path) {
  this.name = name;
  this.prop = prop;
  this.path = path;
  this.handler = handler;
  this.value = '';

  return this;
};

export default {
	data () {
		return {
      baseFilterList: [],
			filterList: [],
      search: ''
		};
	},
	computed: {
    filters () {
      return this._.groupBy(this.filterList, 'prop');
    },
    globalFilters () {
      return this._.groupBy(this.baseFilterList, 'prop');
    },
		filterOptions () {
			return [1,2,3]
		},
    hasFilters () {
      return this.filterList.length;
    },
		filteredData () {
      if (!this.hasFilters && !this.search) {
        return this.sortedData;
      }

			return this._.filter(this.sortedData, (obj) => {
        //let filterCache = {}; // For nested properties
        return this._.some(obj, (val, prop) => {
          //val = valueToString(val, filterCache);
          if (typeof val === 'object') {
            if (val.length > -1) { // Array

            } else { // Object (expensive as fuuck)
              // TOO DOO
              // for (var i = filters.length - 1; i >= 0; i--) {
              //   let filterObj = _.find(filters, ['active', false]);;
              //   if (!filterObj) continue;
              //   if (this._.isEqual(val, filterObj)) {
              //     val = filterObj;
              //     break;
              //   }
              // }
            }
          } else {
            val = typeof val === 'number' ? val.toString() : val;
          }

          //if (this.search && val.indexOf(this.search) === -1) {
          //  return false;
          //}
          if (this.fields[prop].indexable) {
            let filters = this.getFiltersFor(prop); // NOTETOSELF : try to memoize this
            return this._.every(filters, this._.method('handler', val));
          }

          return false;
        });
      });
		}
	},
	methods: {
		makeFilter (name, prop, handler) {
      let path = this._.toPath(prop);
      return new Filter(name, prop, handler, path);
		},
    addFilter (filter) {
      this.$set(this.filterList, this.filterList.length, filter);
    },
    getFiltersFor (prop) {
      let filters = this.filters[prop] ? this.filters[prop] : [];
      let globalFilters = this.globalFilters[prop] ? this.globalFilters[prop] : [];
      globalFilters = this.globalFilters['*'] ? globalFilters.concat(this.globalFilters['*']) : globalFilters;
      filters = globalFilters.length ? filters.concat(globalFilters) : filters;
      filters.concat(this.globalFilters);
      return filters;
    },
		removeFilter (name) {
      this.$delete(this.filterList, name);
		},
		registerFilters () {
      // globals
      this.baseFilterList[this.baseFilterList.length] = new Filter('searchFilter', '*', (val) => {
        if (!this.search) return true;
        //val = valToString(val);
        return val.indexOf(this.search) > -1;
      });
      // customs
			if (this.customFilters && this.customFilters.length) {
				for (let i = 0; i < this.customFilters.length; i++) {
					if (filter.handler) {
						this.addFilter(filter);
					}
				}
			}
		}
	},
	mounted () {
		this.registerFilters();
    window.asd = function () {
      let filter = this.makeFilter('higer shit', 'salary', (val) => {
        return Number(val.replace(/[^0-9\.-]+/g,"")) > 320000;
      });

      this.addFilter(filter);
    }.bind(this);
	}
}
