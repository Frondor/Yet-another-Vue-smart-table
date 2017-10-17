<template>
<div>
	<div class="col-xs-12" v-if="hasSortings">
		<div class="list-inline list-group panel-body">
			<li>
				<strong>Ordernar por:</strong>
			</li>
			<li v-for="(dir, order) in sorting">
				<a href="#" class="badge badge-primary badge-icon" @click.stop.prevent="removeSorting(order)"><i class="fa fa-times" aria-hidden="true"></i><span>{{fields[order].label}}</span></a>
			</li>
		</div>
	</div>
  <input type="text" class="form-control no-margin" v-model="search" placeholder="Search..." v-if="searchForm" v-autofocus>
	<div class="col-xs-12" v-if="hasFilters">
		<div class="list-inline list-group">
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
  <div class="col-xs-12" v-if="$scopedSlots.bulkActions && checkedItems.length">
    <br>
    <ul class="list-inline no-margin">
      <li>{{ checkedItems.length }} items seleccionados:</li>
      <li><slot name="bulkActions"></slot></li>
    </ul>
  </div>
	<table :class="table.classes" cellspacing="0" width="100%">
	    <thead>
	        <tr>
	    		<th v-if="options.bulkSelection && checkedItems.length">
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
	    		<td v-if="options.bulkSelection && checkedItems.length">
	    			<div class="checkbox" style="margin:0!important" @click.stop>
	    				<input type="checkbox" :id="'datatable-item-'+item[keyId]" v-model="checkedItems" :value="item[keyId]">
	    				<label :for="'datatable-item-'+item[keyId]" style="padding:0"></label>
	    			</div>
	    		</td>
        		<td v-for="prop in Object.keys(item)" :key="item[keyId]"
              v-if="fields[prop]"
              @click.self="rowClick(item, index)"
              @contextmenu.prevent="checkItem(item[keyId])">
        			<slot :name="prop" :row="item">{{ item[prop] }}</slot>
        		</td>
          <td v-if="$scopedSlots.displayActions">
            <slot name="tableActions" :row="item"></slot>
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
import _ from 'lodash'
import orderingMixin from './mixins/ordering'
import filteringMixin from './mixins/filtering'
import paginationMixin from './mixins/pagination'
//import Filter from './models/Filter'
// TODO: v-once & keep-alive

export default {
  name: 'data-table',
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
        	perPage: 15
        }
      }
    },
    keyId: {
      type: String,
      default: 'id'
    },
    customFilters: Array
	},
	data () {
		return {
			table: {
				classes: 'datatable table table-striped table-hover no-margin primary'
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
      _.each(this.columns, (column) => {
        columns[column.name] = _.merge({
          label: column.label ? column.label : column.name,
          sortable: true,
          indexable: true
        }, column);
      });
      return columns;
    }
	},
	methods: {
		checkItem (value) { // toggle
			if (!value) { // toggle all
        let wholePageSelected = this.collection.every(item => {
          return this.checkedItems.indexOf(item[this.keyId]) > -1
        })
				if (wholePageSelected) {
          for (var i = this.collection.length - 1; i >= 0; i--) {
            this.checkItem(this.collection[i][this.keyId])
          }
        }
        else {
          this.collection.reduce((checkedItems, item) => {
            if (checkedItems.indexOf(item[this.keyId]) === -1)
              checkedItems.push(item[this.keyId])
            return checkedItems
          }, this.checkedItems)
        }
				return;
			}

      let index = this.checkedItems.indexOf(value);
	    if (index === -1) {
	    	this.checkedItems.push(value);
	    } else {
	      this.checkedItems.splice(index, 1);
	    }
		},
		rowClick (item, index) {
			if (this.options.bulkSelection && this.checkedItems.length) {
				this.checkItem(item[this.keyId]);
			} else {
        this.$emit('row-click', item, index)
      }
		},
    toggleSearch () {
      return this.searchForm = !this.searchForm;
    }
	},
  mounted () {
  }
}
</script>

<style scoped>
td {
  user-select:none;
  vertical-align: middle !important;
}
</style>
