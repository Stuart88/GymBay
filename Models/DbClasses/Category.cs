using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public int CategoryLevel { get; set; }
        public string CategoryPath { get; set; }
    }
}
