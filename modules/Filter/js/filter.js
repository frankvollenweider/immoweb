(function($) {

    Tc.Module.Filter = Tc.Module.extend({

        // Template-Cache
        templatesCache: [],

        on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(1, this); // Filter

            // compile templates
            this.templatesCache['tmpl-filter-option'] = doT.template($('#tmpl-filter-option').text());

            // bind filter change action
            this.$ctx.on('change', '.filter select', function() {
                that.filterChanged();
            });

            callback();
        },
        
        after: function() {
            // NOOP
        },

        appendOptionToSelect: function(items, $select) {
            
            var that = this;

            if (items) {
                $.each(items, function(key, item) {
                    $select.append($(that.templatesCache['tmpl-filter-option'](item)));
                });
            }

        },

        filterChanged: function() {
            
            var $ctx = this.$ctx;
            var that = this;

            var filterValues = {
                estateId : $('#fld-estate', $ctx).val(),
                propertyId : $('#fld-property', $ctx).val(),
                categoryId : $('#fld-expensecategory', $ctx).val()
            };

            that.fire('filterChanged', filterValues, [1]); // Filter

        },

        onFilterDataLoaded: function(data) {
            
            var $ctx = this.$ctx;
            var that = this;

            that.appendOptionToSelect(data.estates, $('#fld-estate', $ctx));
            that.appendOptionToSelect(data.properties, $('#fld-property', $ctx));
            that.appendOptionToSelect(data.categories, $('#fld-expensecategory', $ctx));

        }

    });

})(Tc.$);