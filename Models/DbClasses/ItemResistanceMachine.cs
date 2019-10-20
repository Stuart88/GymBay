using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class ItemResistanceMachine
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public string Description { get; set; }
        public int? Legs { get; set; }
        public int? Chest { get; set; }
        public int? Arms { get; set; }
        public int? Back { get; set; }
        public int? Abs { get; set; }
        public int? Shoulders { get; set; }
        public int SellerId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
