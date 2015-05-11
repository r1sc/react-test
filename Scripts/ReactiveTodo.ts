/// <reference path="typings/signalr/signalr.d.ts" />

module App {
    export class Todo {
        id: string = null;
        description: string = null;
        complete: boolean = false;

        constructor() {
            ko.track(this);

            var self = this;
            ko.getObservable(this, 'complete').subscribe((newValue: boolean) => {
                $.post('Todo/AddOrUpdate', self);
            });
        }
    }

    export class ViewModel {
        public todos: IReactiveCollection<Todo> = App.todoCollection;
        public description: string = "";

        constructor() {
            var self = this;
            $.get('Todo').done(self.todos.setContents);
        }

        public addTodo = (form: HTMLFormElement) => {
            $.post('Todo/AddOrUpdate', {
                    description: this.description
                })
                .fail((error) => {
                    alert("Error adding todo: " + error.statusText);
                });
            form.reset();
            return false;
        }
    }
}