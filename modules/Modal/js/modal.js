(function($) {

    Tc.Module.Modal = Tc.Module.extend({

        // Template-Cache
        templatesCache: [],

        on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(2, this); // Modal

            // compile templates
            this.templatesCache['tmpl-edit-item'] = doT.template($('#tmpl-edit-item').text());

            // bind modal close action
            this.$ctx.on('click', '.btn-cancel', function() {
            	var $modal = $('.modal', $ctx);
            	$modal.hide();
            	$modal.empty();
            });

            // bind modal save actions
            this.$ctx.on('blur', '.fld', function() {
            	var $modal = $('.modal', $ctx);
            	var fieldData = {
                    id : $modal.data('id'),
            	    fieldname : $(this).data('field'),
            	    fieldvalue : $(this).val()
            	};
                that.fire('itemSave', fieldData, [2]); // Modal
            });

            // bind modal delete action
            this.$ctx.on('click', '.btn-delete', function() {
            	var $modal = $('.modal', $ctx);
            	var itemData = {
                    id : $modal.data('id')
            	};
                that.fire('itemDelete', itemData, [2]); // Modal
            	$modal.hide();
            	$modal.empty();
            });

            callback();
        },
        
        after: function() {
            // NOOP
        },

        onEditItem: function(data) {

            var that = this;
            var $ctx = this.$ctx;

            var item = data.item;
        	var $modal = $('.modal', $ctx);
            var editItem = $(that.templatesCache['tmpl-edit-item'](item));
            $modal.html(editItem);
            $modal.data('id', item.id);
            $modal.fadeIn('fast');

        }

    });

})(Tc.$);