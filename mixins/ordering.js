export default {
	data () {
		return {
			sorting: {}
		};
	},
	computed: {
		orderBy () {
			return Object.keys(this.sorting);
		},
		orderSort () { // keep indexes in sync with this.orderBy for lodash _.orderBy
			let sort = [];
			for (var i = 0; i < this.orderBy.length; i++) {
				sort[i] = this.sorting[this.orderBy[i]];
			}
			return sort;
		},
		hasSortings () {
			return this.orderBy.length
		},
		sortedData () {
      if (!this.hasSortings) {
        return this.data;
      }
			return this._.orderBy(this.data, this.orderBy, this.orderSort);
		}
	},
	methods: {
		sort (column, event) {
      if (!column.sortable) return;
      let prop = column.name;
			if (this.sorting[prop]) {
				this.$set(this.sorting, prop, this.sorting[prop] === 'asc' ? 'desc' : 'asc');
			} else {
				if (!event.ctrlKey) {
					this.sorting = {};
				}
				this.$set(this.sorting, prop, 'asc');
			}
		},
		removeSorting (prop) {
			this.$delete(this.sorting, prop);
		}
	}
}
