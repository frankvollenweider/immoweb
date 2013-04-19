(function($) {

    Tc.Module.Filter = Tc.Module.extend({

        // Template-Cache
        templatesCache: [],

        on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(1, this); // Filter

            // compile templates
            this.templatesCache['option'] = doT.template($('#option').text());

            // bind filter change action
            this.$ctx.on('change', '.filter select', function() {
                that.filterChanged();
            });

            callback();
        },
        
        after: function() {
            // NOOP
        },

        onFilterDataLoaded: function(data) {
            
            var $ctx = this.$ctx;
            var that = this;

            if (data.estates) {
                $.each(data.estates, function(key, item) {
                    $('#fld-liegenschaft', $ctx).append($(that.templatesCache['option'](item)));
                });
            }
            if (data.properties) {
                $.each(data.properties, function(key, item) {
                    $('#fld-objekt', $ctx).append($(that.templatesCache['option'](item)));
                });
            }
            if (data.categories) {
                $.each(data.categories, function(key, item) {
                    $('#fld-ausgabentyp', $ctx).append($(that.templatesCache['option'](item)));
                });
            }
        },

        filterChanged: function() {
            
            var $ctx = this.$ctx;
            var that = this;

            var filterValues = {
                estateId : $('#fld-liegenschaft', $ctx).val(),
                propertyId : $('#fld-objekt', $ctx).val(),
                categoryId : $('#fld-ausgabentyp', $ctx).val()
            };

            that.fire('filterChanged', filterValues, [1]); // Filter
        }

    });

})(Tc.$);