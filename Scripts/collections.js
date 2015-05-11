var App;
(function (App) {
    App.todoCollection;
    function setupCollections() {
        hubConnection = $.hubConnection(window.location.pathname);
        /* Setup collections here */
        App.todoCollection = App.react('todoHub', function (todo) {
            var obj = new App.Todo();
            obj.id = todo.id;
            obj.description = todo.description;
            obj.complete = todo.complete;
            return obj;
        });
        hubConnection.start().done(function () { return console.log("SignalR connected"); }).fail(function (e) { return console.log("Error setting up collections: " + e); });
    }
    App.setupCollections = setupCollections;
})(App || (App = {}));
//# sourceMappingURL=collections.js.map