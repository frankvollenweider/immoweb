(function($) {

    Tc.Module.ExpenseList = Tc.Module.extend({

    	simulate: false,

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
            this.sandbox.subscribe(2, this); // Modal

            // compile templates
            this.templatesCache['tmpl-expense'] = doT.template($('#tmpl-expense').text());

            // bind edit action to table rows
            this.$ctx.on('click', 'tbody tr', function() {
                that.editExpense($(this).data('id'));
            });

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
                url: serviceUrl('expenses/load', that.simulate),
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

        editExpense: function(id) {

            var that = this;
            var $ctx = this.$ctx;

            that.loadExpense(id, function(expense) {
                that.fire('editItem', { item : expense }, [2]); // Modal
            });

        },

        loadExpense: function(id, callback) {

            var that = this;
            var $ctx = this.$ctx;

            var data = {
                "id": id
            };

            $.ajax({
                type: 'POST',
                url: serviceUrl('expenses/find', that.simulate),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                	// replace in table
                    $('tr[data-id="' + data.expense.id + '"]', $ctx).replaceWith($(that.templatesCache['tmpl-expense'](data.expense)));

                	// replace in cache
                	that.expensesCache[data.expense.id] = data.expense;

                	callback(data.expense);
                }
            });

        },

        createExpense: function(callback) {

            var that = this;
            var $ctx = this.$ctx;

            var data = {};

            $.ajax({
                type: 'POST',
                url: serviceUrl('expenses/create', that.simulate),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                	// add to cache
                	that.expensesCache[data.expense.id] = data.expense;

                	callback(data.expense);
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
                    var newExpense = $(that.templatesCache['tmpl-expense'](expense));
                    $('table', $ctx).append(newExpense);
                });
            }

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
                url: serviceUrl('expenses/filter', that.simulate),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                    that.renderExpenses(data.expenses);

                }
            });

        },

        onItemNew: function(data) {

            var that = this;

            that.createExpense(function(expense) {
        		that.fire('editItem', { item : expense }, [2]); // Modal
        	});

        },

        onItemSave: function(fieldData) {

            var that = this;
            var $ctx = this.$ctx;

            // should we really save or is it the same value?
            var oldExpense = that.expensesCache[fieldData.id];
            if (fieldData.fieldvalue == oldExpense[fieldData.fieldname]) { return; }

            var data = {
            	"id": fieldData.id,
            	"fieldname": fieldData.fieldname,
            	"fieldvalue": fieldData.fieldvalue
            };

            $.ajax({
                type: 'POST',
                url: serviceUrl('expenses/save', that.simulate),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                	// replace in table
                    $('tr[data-id="' + data.expense.id + '"]', $ctx).replaceWith($(that.templatesCache['tmpl-expense'](data.expense)));

                	// replace in cache
                	that.expensesCache[data.expense.id] = data.expense;

                }
            });

        },

        onItemDelete: function(itemData) {

            var that = this;
            var $ctx = this.$ctx;

            var data = {
                "id": itemData.id
            };

            $.ajax({
                type: 'POST',
                url: serviceUrl('expenses/delete', that.simulate),
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(data) {

                    if (!data.success) { that.onError(data.messages); return; };

                	// remove from table
                    $('tr[data-id="' + data.id + '"]', $ctx).remove();

                	// remove from cache
                	delete that.expensesCache[data.id];

                }
            });

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