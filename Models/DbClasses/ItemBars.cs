using System;

namespace GymBay.Models.DbClasses
{
    public partial class ItemBars
    {
        #region Public Properties

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public DateTime CreationDate { get; set; }
        public string Description { get; set; }
        public int Id { get; set; }
        public int Length { get; set; }
        public int Material { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public int SellerId { get; set; }
        public int Weight { get; set; }

        #endregion Public Properties
    }
}