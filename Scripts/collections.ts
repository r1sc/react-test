module App {
    declare var hubConnection: HubConnection;
    export var todoCollection: IReactiveCollection<Todo>;

    export function setupCollections() {
        hubConnection = $.hubConnection(window.location.pathname);

        /* Setup collections here */
        todoCollection = <IReactiveCollection<Todo>>react('todoHub', (todo: Todo) => {
            var obj = new Todo();
            obj.id = todo.id;
            obj.description = todo.description;
            obj.complete = todo.complete;
            return obj;
        });

        hubConnection.start()
            .done(() => console.log("SignalR connected"))
            .fail((e) => console.log("Error setting up collections: " + e));
    }
} 