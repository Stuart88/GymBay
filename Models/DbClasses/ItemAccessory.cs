using System;

namespace GymBay.Models.DbClasses
{
    public partial class ItemAccessory
    {
        #region Public Properties

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public DateTime CreationDate { get; set; }
        public string Description { get; set; }
        public int Gender { get; set; }
        public int Id { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Name { get; set; }
        public string Postage { get; set; }
        public double Price { get; set; }
        public int SellerId { get; set; }
        public int? SizeL { get; set; }
        public int? SizeM { get; set; }
        public int? SizeNa { get; set; }
        public int? SizeS { get; set; }

        #endregion Public Properties
    }
}