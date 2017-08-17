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
			return this._.orderBy(this.data, this.orderBy, this.orderSort);
		}
	},
	methods: {
		setOrder (prop, event) {
			if (this.sorting[prop]) {
				this.$set(this.sorting, prop, this.sorting[prop] === 'asc' ? 'desc' : 'asc');
			} else {
				if (!event.ctrlKey) {
					this.sorting = {};
				}
				this.$set(this.sorting, prop, 'asc');
			}
		},
		removeOrder (prop) {
			this.$delete(this.sorting, prop);
		}
	}
}