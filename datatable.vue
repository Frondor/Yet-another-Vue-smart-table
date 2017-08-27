<template>
<div>

	<div class="col-xs-12 col-md-12">
		<div class="list-inline list-group panel-body" v-if="hasSortings">
			<li>
				<strong>Ordernar por:</strong>
			</li>
			<li v-for="(dir, order) in sorting">
				<a href="#" class="badge badge-primary badge-icon" @click.stop.prevent="removeSorting(order)"><i class="fa fa-times" aria-hidden="true"></i><span>{{order}}</span></a>
			</li>
		</div>
	</div>
  <input type="text" class="form-control input-lg" v-model="search" placeholder="Search..." v-if="searchForm" v-autofocus>
	<div class="col-xs-12 col-md-12">
		<div class="list-inline list-group" v-if="hasFilters">
			<li>
				<strong>Filtrar por:</strong>
			</li>
			<li v-for="(filter, prop) in filters">
				<div class="input-group">
          <div class="input-group-addon">{{ prop }}</div>
          <input type="text" v-model="f.value" class="form-control" placeholder="Filter value" v-for="f in filter">
        </div>
			</li>
		</div>
	</div>
	<table :class="table.classes" cellspacing="0" width="100%">
	    <thead>
	        <tr>
	    		<th v-if="options.bulkSelection">
	    			<div class="checkbox" style="margin:0!important" @click.stop="checkItem()">
	    				<input type="checkbox" :checked="this.checkedItems.length">
	    				<label for="" style="padding:0"></label>
	    			</div>
	    		</th>
	            <th v-for="th in fields" @click.stop="sort(th, $event)" class="text-capitalize">
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
import filteringMixin from './mixins/filtering'
import paginationMixin from './mixins/pagination'
import dropdown from '../button/dropdown'
//import Filter from './models/Filter'
// TODO: v-once & keep-alive

export default {
	mixins:[paginationMixin, orderingMixin, filteringMixin],
  directives: {
    'autofocus': {
      inserted: function (el) {
        el.focus()
      }
    }
  },
	props: {
		data: Array,
		columns: Array,
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
    customFilters: Array
	},
	data () {
		return {
			table: {
				classes: 'datatable table table-striped no-margin primary'
			},
			checkedItems: [],
      searchForm: false
		}
	},
	computed: {
		collection () {
			return this.paginate(this.filteredData);
		},
    fields () {
      let columns = {};
      this._.each(this.columns, (column) => {
        columns[column.name] = this._.merge({
          label: column.label ? column.label : column.name,
          sortable: true,
          indexable: true
        }, column);
      });
      console.log(columns);
      return columns;
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
		},
    toggleSearch () {
      return this.searchForm = !this.searchForm;
    }
	},
	components: {
		dropdown
	},
	mounted () {
		//console.log(this, this.perPage, this.data)
	}
}
</script>
