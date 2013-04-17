(function($) {
    /**
     * ExpenseList module implementation.
     *
     * @author Roger Dudler <roger.dudler@namics.com>
     * @namespace Tc.Module
     * @class ExpenseList
     * @extends Tc.Module
     */
    Tc.Module.ExpenseList = Tc.Module.extend({
        
        on: function(callback) {
            var that = this;
            var $ctx = this.$ctx;

            var data = {
                'title': 'fjklasdjfskfsd'
            };
            var template = doT.template($('script', $ctx).text());
            
            var row = $(template(data));
            $('table', $ctx).append(row);
            row = $(template(data));
            $('table', $ctx).append(row);
            row = $(template(data));
            $('table', $ctx).append(row);
            row = $(template(data));
            $('table', $ctx).append(row);


            callback();
        },
        
        after: function() {
            
        }

    });
})(Tc.$);