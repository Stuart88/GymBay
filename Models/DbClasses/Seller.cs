using System;

namespace GymBay.Models.DbClasses
{
    public partial class Seller
    {
        #region Public Properties

        public int? CityId { get; set; }
        public string CityName { get; set; }
        public string ContactPerson { get; set; }
        public int? CountryId { get; set; }
        public string CountryName { get; set; }
        public DateTime CreationDate { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public int Id { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int? Phone { get; set; }
        public string ShopName { get; set; }
        public int? Status { get; set; }

        #endregion Public Properties
    }
}