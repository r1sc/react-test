using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ReactiveTodo.Models
{
    public class TodoModel
    {
        public Guid Id { get; set; }
        [MinLength(5, ErrorMessage = "At least 5 characters should be typed")]
        public string Description { get; set; }
        public bool Complete { get; set; }
    }
}