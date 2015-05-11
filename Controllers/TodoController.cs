using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;
using Antlr.Runtime;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ReactiveTodo.Hubs;
using ReactiveTodo.Models;

namespace ReactiveTodo.Controllers
{
    public class BetterJsonResult<T> : ActionResult
    {
        private readonly string _serializedData;
        public BetterJsonResult(T data)
        {
            _serializedData = JsonConvert.SerializeObject(
                data,
                Formatting.Indented,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
            );
        }

        public override void ExecuteResult(ControllerContext context)
        {
            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.Write(_serializedData);
        }
    }

    public class TodoController : Controller
    {
        private static List<TodoModel> _todos = new List<TodoModel>
        {
            new TodoModel { Id = Guid.NewGuid(), Description = "Feed the birds", Complete = true },
            new TodoModel { Id = Guid.NewGuid(), Description = "Write this blogpost", Complete = false },
            new TodoModel { Id = Guid.NewGuid(), Description = "Buy coffee", Complete = false }
        };

        // GET: Todo
        public BetterJsonResult<IEnumerable<TodoModel>> Index()
        {
            return new BetterJsonResult<IEnumerable<TodoModel>>(_todos);
        }

        [HttpPost]
        public ActionResult AddOrUpdate(TodoModel todoModel)
        {
            var todo = _todos.SingleOrDefault(x => x.Id == todoModel.Id);
            if (todo == null)
            {
                todo = new TodoModel { Id = Guid.NewGuid() };
                _todos.Add(todo);
            }
            todo.Description = todoModel.Description;
            todo.Complete = todoModel.Complete;

            GlobalHost.ConnectionManager.GetHubContext<TodoHub>().Clients.All.update(todo);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}