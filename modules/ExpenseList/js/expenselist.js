(function($) {

	"use strict";

	/**
     * ExpenseList module implementation.
     *
     * @author Frank Vollenweider <frank@vollenweider.info>
     * @namespace Tc.Module
     * @class ExpenseList
     * @extends Tc.Module
     */
    Tc.Module.ExpenseList = Tc.Module.extend({

    	// Template-Cache
        templatesCache: [],

        // Data-Cache
        estatesCache: [],
        propertiesCache: [],
        expenseCategoriesCache: [],
        expensesCache: [],

        on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(1, this); // FilterData

            // compile templates
            this.templatesCache['expense'] = doT.template($('#expense').text());

            // initial load
            this.load();
            console.log("expenselist.js: end of on");

            callback();
        },
        
        after: function() {

            var that = this;
            var $ctx = this.$ctx;

            var filterData = {
                estates : that.estatesCache,
                properties : that.propertiesCache,
                categories : that.expenseCategoriesCache
            };
            console.log("expenselist.js: end of after (bevor fire....)");
            that.fire('filterDataLoaded', filterData, [1]); // FilterData

        },

        load: function() {

            var that = this;
            var $ctx = this.$ctx;

            var data = {};

            $.ajax({
                type: 'POST',
                url: serviceUrl('expenses/load'),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                    if (data.estates) {
                    	that.addToCache(data.estates, that.estatesCache);
                    }

                    if (data.properties) {
                    	that.addToCache(data.properties, that.propertiesCache);
                    }

                    if (data.expenseCategories) {
                        that.addToCache(data.expenseCategories, that.expenseCategoriesCache);
                    }

                    if (data.expenses) {
                        that.addToCache(data.expenses, that.expensesCache);
                    	var $table = $('table', $ctx);
                    	$.each(data.expenses, function(key, expense) {
                    		expense.category["title"] = that.expenseCategoriesCache[expense.category.id].title;
                    		var newExpense = $(that.templatesCache['expense'](expense));
                    		$('table', $ctx).append(newExpense);
                    	});
                    }

                }
            });
			console.log("expenselist.js: End of load");

        },

        addToCache: function(items, cache) {
        	if (items) {
        		$.each(items, function(key, item) {
                	cache[item.id] = item;
                });
        	}
        },

        onError: function(messages) {
            var $messages = $('.messages');
            $.each(messages, function(key, message) {
                var $msg = $('<div class="msg msg-' + message.type + '">' + message.message + '</div>');
                $messages.append($msg);
                $msg.fadeIn('fast');
            });
        }

    });
})(Tc.$);