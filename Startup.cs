using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;
using Microsoft.Owin;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using ReactiveTodo.Hubs;
using ReactiveTodo.SignalR.ToDo.Configuration;

[assembly: OwinStartup(typeof(ReactiveTodo.Startup))]

namespace ReactiveTodo
{
    namespace SignalR.ToDo.Configuration
    {
        /// <summary>
        /// From <a href="https://github.com/SignalR/SignalR/issues/500">SignalR Github</a>
        /// </summary>
        public class SignalRContractResolver : IContractResolver
        {
            private readonly Assembly _assembly;
            private readonly IContractResolver _camelCaseContractResolver;
            private readonly IContractResolver _defaultContractSerializer;

            public SignalRContractResolver()
            {
                _defaultContractSerializer = new DefaultContractResolver();
                _camelCaseContractResolver = new CamelCasePropertyNamesContractResolver();
                _assembly = typeof(Connection).Assembly;
            }

            public JsonContract ResolveContract(Type type)
            {
                if (type.Assembly.Equals(_assembly))
                {
                    return _defaultContractSerializer.ResolveContract(type);
                }

                return _camelCaseContractResolver.ResolveContract(type);
            }
        }
    }

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            app.MapSignalR();

            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new SignalRContractResolver();
            var serializer = JsonSerializer.Create(settings);
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);
        }
    }
}
