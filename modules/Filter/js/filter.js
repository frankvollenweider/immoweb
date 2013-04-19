(function($) {
    /**
     * ExpenseList module implementation.
     *
     * @author Frank Vollenweider <frank@vollenweider.info>
     * @namespace Tc.Module
     * @class Filter
     * @extends Tc.Module
     */
    Tc.Module.Filter = Tc.Module.extend({

    	// Template-Cache
        templatesCache: [],

    	on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(1, this); // FilterData

            // compile templates
            this.templatesCache['option'] = doT.template($('#option').text());
			console.log("filter.js: End of load");

            callback();
        },
        
        after: function() {
			console.log("filter.js: End of after");
        },

        onFilterDataLoaded: function(data) {
			console.log("filter.js: onFilterDataLoaded - " + data.estates);
        	if (data.estates) {
        		$.each(data.estates, function(key, item) {
                	console.log("FVO - " + item);
        			$('#fld-liegenschaft', $ctx).append($(that.templatesCache['option'](item)));
                });
        	}
			console.log("filter.js: onFilterDataLoaded - " + data.properties);
        	if (data.properties) {
        		$.each(data.properties, function(key, item) {
                	console.log("FVO - " + item);
        			$('#fld-objekt', $ctx).append($(that.templatesCache['option'](item)));
                });
        	}
			console.log("filter.js: onFilterDataLoaded - " + data.categories);
        	if (data.categories) {
        		$.each(data.categories, function(key, item) {
                	console.log("FVO - " + item);
        			$('#fld-ausgabentyp', $ctx).append($(that.templatesCache['option'](item)));
                });
        	}
        }

    });
})(Tc.$);