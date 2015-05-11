var App;
(function (App) {
    function react(collectionName, mapper) {
        var array = [];
        array.index = {};
        function add(obj) {
            var newObj = mapper(obj);
            array.index[newObj.id] = newObj;
            array.push(newObj);
        }
        array.setContents = function (items) {
            array.length = 0;
            array.index = {};
            for (var i = 0; i < items.length; i++) {
                add(items[i]);
            }
        };
        var hubProxy = hubConnection.createHubProxy(collectionName);
        hubProxy.on('update', function (obj) {
            var oldObj = array.index[obj.id];
            if (oldObj == null)
                add(obj);
            else {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        oldObj[prop] = obj[prop];
                    }
                }
            }
        });
        return array;
    }
    App.react = react;
})(App || (App = {}));
//# sourceMappingURL=react.js.map