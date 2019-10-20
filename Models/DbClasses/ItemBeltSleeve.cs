using System;

namespace GymBay.Models.DbClasses
{
    public partial class ItemBeltSleeve
    {
        #region Public Properties

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public DateTime CreationDate { get; set; }
        public string Description { get; set; }
        public int Id { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public int SellerId { get; set; }
        public int? Size2xl { get; set; }
        public int? Size3xl { get; set; }
        public int? Size4xl { get; set; }
        public int? Size5xl { get; set; }
        public int? SizeL { get; set; }
        public int? SizeM { get; set; }
        public int? SizeS { get; set; }
        public int? SizeXl { get; set; }
        public int? SizeXs { get; set; }
        public int? SizeXxs { get; set; }
        public int? SizeXxxs { get; set; }

        #endregion Public Properties
    }
}