using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class ItemAccessory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public string Postage { get; set; }
        public int Gender { get; set; }
        public int? SizeS { get; set; }
        public int? SizeM { get; set; }
        public int? SizeL { get; set; }
        public int? SizeNa { get; set; }
        public int SellerId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
