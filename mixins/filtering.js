/** NOTETOSELF:
  * Current state: ¡A MESS!
  */
import _ from 'lodash'

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
      return _.groupBy(this.filterList, 'prop');
    },
    globalFilters () {
      return _.groupBy(this.baseFilterList, 'prop');
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

			return _.filter(this.sortedData, (obj) => {
        //let filterCache = {}; // For nested properties
        return _.every(obj, (val, prop) => {
          if (!this.fields[prop].indexable) {
            return true;
          }
          val = this.valueToString(val);
/*
Hay un problema con la forma en la que los filtros recorren el objeto.
En en caso del filtro especial searchFilter es necesario hacerlo con _.some sobre TODAS propiedades,
y los filtros comunes generalmente con ._every PERO sobre las propiedades ESPECIFICAS que
el filtro use.
*/
          let filters = this.getFiltersFor(prop); // NOTETOSELF : try to memoize this
          return _.every(filters, (filter) => {
            return filter.handler(val);
          });
          console.error('This shouldnt ever reach here, probably no filters for this');
          return true; // in case of no filters matching this property
        });
      });
		}
	},
	methods: {
		makeFilter (name, prop, handler) {
      let path = _.toPath(prop);
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
    valueToString (val) {
      if (typeof val === 'object') {
        if (val.length > -1) { // Array

        } else { // Object (expensive as fuuck)
          // TOO DOO
          // for (var i = filters.length - 1; i >= 0; i--) {
          //   let filterObj = _.find(filters, ['active', false]);;
          //   if (!filterObj) continue;
          //   if (_.isEqual(val, filterObj)) {
          //     val = filterObj;
          //     break;
          //   }
          // }
        }
      } else {
        val = typeof val === 'number' ? val.toString() : val;
      }
      return val;
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
