/// <reference path="typings/signalr/signalr.d.ts" />
var App;
(function (App) {
    var Todo = (function () {
        function Todo() {
            this.id = null;
            this.description = null;
            this.complete = false;
            ko.track(this);
            var self = this;
            ko.getObservable(this, 'complete').subscribe(function (newValue) {
                $.post('Todo/AddOrUpdate', self);
            });
        }
        return Todo;
    })();
    App.Todo = Todo;
    var ViewModel = (function () {
        function ViewModel() {
            var _this = this;
            this.todos = App.todoCollection;
            this.description = "";
            this.addTodo = function (form) {
                $.post('Todo/AddOrUpdate', {
                    description: _this.description
                }).fail(function (error) {
                    alert("Error adding todo: " + error.statusText);
                });
                form.reset();
                return false;
            };
            var self = this;
            $.get('Todo').done(self.todos.setContents);
        }
        return ViewModel;
    })();
    App.ViewModel = ViewModel;
})(App || (App = {}));
//# sourceMappingURL=ReactiveTodo.js.map