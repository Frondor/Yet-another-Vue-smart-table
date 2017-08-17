<template>
<div>
	<table :class="table.classes" cellspacing="0" width="100%">
	    <thead>
	        <tr>
	    		<th v-if="options.bulkSelection">
	    			<div class="checkbox" style="margin:0!important" @click.stop="checkItem()">
	    				<input type="checkbox" :checked="this.checkedItems.length">
	    				<label for="" style="padding:0"></label>
	    			</div>
	    		</th>
	            <th v-for="th in headings" @click.stop="setOrder(th.name, $event)">
	            	{{ th.label }}
	            	<span v-if="sorting[th.name]">
	            		<i class="fa" :class="sorting[th.name] === 'desc' ? 'fa-arrow-down':'fa-arrow-up'"></i>
	            	</span>
	            </th>
	        </tr>
	    </thead>
	    <tbody>
        	<tr v-for="(item, index) in collection">
	    		<td v-if="options.bulkSelection">
	    			<div class="checkbox" style="margin:0!important" @click.stop>
	    				<input type="checkbox" :id="'datatable-item-'+index" v-model="checkedItems" :value="index">
	    				<label :for="'datatable-item-'+index" style="padding:0"></label>
	    			</div>
	    		</td>
        		<td v-for="prop in Object.keys(item)" @click.self="rowClick(index)">
        			<slot :name="prop" :row="item">{{ item[prop] }}</slot>
        		</td>
        	</tr>
	    </tbody>
	</table>
	<div class="card-body clearfix">
		<nav class="pull-right">
		  <ul class="pagination">
		  <!-- TO-DO Hacer más dinámico Next y Prev-->
		    <li>
		      <a href="#" aria-label="Previous" @click.prevent="setPage(pagination.currentPage-1)">
		        <span aria-hidden="true">«</span>
		      </a>
		    </li>
		    <li v-for="p in pagination.pages" :class="{'active': p === pagination.currentPage}">
		    	<a href="#" @click.prevent="setPage(p)">{{ p }}</a>
		    </li>
		    <li>
		      <a href="#" aria-label="Next" @click.prevent="setPage(pagination.currentPage+1)">
		        <span aria-hidden="true">»</span>
		      </a>
		    </li>
		  </ul>
		</nav>
	</div>
</div>
</template>

<script>
import orderingMixin from './mixins/ordering'
import paginationMixin from './mixins/pagination'

export default {
	mixins:[paginationMixin, orderingMixin],
	props: {
		data: Array,
		headings: Array,
		options: {
	      type: Object,
	      default: function () {
	        return {
	        	bulkSelection: true,
	        	checkOnClick: true,
	        	perPage: 15
	        }
	      }
	    },		
	},
	data () {
		return {
			table: {
				classes: 'datatable table table-striped no-margin primary'
			},
			checkedItems: [],
			filters: []
		}
	},
	computed: {
		collection () {
			if (this.filters.length || this.hasSortings) {
				let data; // or should I use this.data instead?
				if (this.hasSortings) { // Order first
					data = this.sortedData;
				}
				else { // Apply filters later
					console.log('CONCHA')
				}
				return this.paginate(data);
			}
			return this.paginate(this.data);
		}
	},
	methods: {
		checkItem (value) { // toggle
			let index = this.checkedItems.indexOf(value);

			if (value === undefined) { // toggle all
				this.checkedItems = this.checkedItems.length ? [] : this._.range(0, this.data.length);
				return;
			}

		    if (index === -1) {
		    	this.checkedItems.push(value);
		    } else {
		        this.checkedItems.splice(index, 1);
		    }
		},
		rowClick (index) {
			if (this.options.bulkSelection && this.options.checkOnClick) {
				this.checkItem(index);
			}
		}
	},
	mounted () {
		//console.log(this, this.perPage, this.data)
	}
}
</script>