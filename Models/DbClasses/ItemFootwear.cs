using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class ItemFootwear
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
        public int? Size1 { get; set; }
        public int? Size2 { get; set; }
        public int? Size3 { get; set; }
        public int? Size4 { get; set; }
        public int? Size5 { get; set; }
        public int? Size6 { get; set; }
        public int? Size7 { get; set; }
        public int? Size8 { get; set; }
        public int? Size9 { get; set; }
        public int? Size10 { get; set; }
        public int? Size11 { get; set; }
        public int? Size12 { get; set; }
        public int? Size13 { get; set; }
        public int? Size14 { get; set; }
        public int? Size15 { get; set; }
        public int? Size16 { get; set; }
        public int SellerId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
