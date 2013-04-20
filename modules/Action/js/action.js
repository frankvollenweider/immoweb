(function($) {

    Tc.Module.Action = Tc.Module.extend({

        on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(2, this); // Modal

            // bind filter change action
            this.$ctx.on('click', 'button', function() {
                that.fire('itemNew', { id : null }, [2]); // Modal
            });

            callback();
        },
        
        after: function() {
            // NOOP
        }

    });

})(Tc.$);