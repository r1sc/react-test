module App {
    declare var hubConnection: HubConnection;

    export interface IData {
        id: string;
    } 

    export interface IReactiveCollection<T> {
        setContents: (items: T[]) => void;
        [key: number]: T;
    }

    export function react<T extends IData>(collectionName: string, mapper: (obj: T) => T): IReactiveCollection<T> {
        var array: any = [];
        array.index = {};
        function add(obj) {
            var newObj = mapper(obj);
            array.index[newObj.id] = newObj;
            array.push(newObj);
        }
        array.setContents = (items: T[]) => {
            array.length = 0;
            array.index = {};
            for (var i = 0; i < items.length; i++) {
                add(items[i]);
            }
        };

        var hubProxy: HubProxy = hubConnection.createHubProxy(collectionName);
        hubProxy.on('update',(obj: T) => {
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
        return <IReactiveCollection<T>>array;
    }
} 