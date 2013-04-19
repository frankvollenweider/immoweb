(function($) {

    Tc.Module.ExpenseList = Tc.Module.extend({

        // Template-Cache
        templatesCache: {},

        // Data-Cache
        estatesCache: {},
        propertiesCache: {},
        expenseCategoriesCache: {},
        expensesCache: {},

        on: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            this.sandbox.subscribe(1, this); // Filter

            // compile templates
            this.templatesCache['expense'] = doT.template($('#expense').text());

            callback();
        },
        
        after: function() {
            // initial load
            this.load();
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

                    that.addToCache(data.estates, that.estatesCache);

                    that.addToCache(data.properties, that.propertiesCache);

                    that.addToCache(data.expenseCategories, that.expenseCategoriesCache);

                    that.renderExpenses(data.expenses);

                    var filterData = {
                        estates : that.estatesCache,
                        properties : that.propertiesCache,
                        categories : that.expenseCategoriesCache
                    };

                    that.fire('filterDataLoaded', filterData, [1]); // Filter

                }
            });

        },

        addToCache: function(items, cache) {
            if (items) {
                $.each(items, function(key, item) {
                    cache[item.id] = item;
                });
            }
        },

        onFilterChanged: function(filterValues) {

            var that = this;
            var $ctx = this.$ctx;

            var data = {
                "filterValues": {
                	"estateId": filterValues.estateId,
                	"propertyId": filterValues.propertyId,
                	"categoryId": filterValues.categoryId
                }
            };

            $.ajax({
                type: 'POST',
                url: serviceUrl('expenses/filter'),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                    that.renderExpenses(data.expenses);

                }
            });
        },

        renderExpenses: function(expenses) {

            var that = this;
            var $ctx = this.$ctx;

            if (expenses) {
            	that.expensesCache = {};
                that.addToCache(expenses, that.expensesCache);
                var $table = $('table', $ctx);
                $table.empty();
                $.each(expenses, function(key, expense) {
                    expense.category["title"] = that.expenseCategoriesCache[expense.category.id].title;
                    var newExpense = $(that.templatesCache['expense'](expense));
                    $('table', $ctx).append(newExpense);
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