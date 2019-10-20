using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class Seller
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Email { get; set; }
        public int? Phone { get; set; }
        public string ContactPerson { get; set; }
        public string ShopName { get; set; }
        public int? CountryId { get; set; }
        public int? CityId { get; set; }
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string Description { get; set; }
        public int? Status { get; set; }
    }
}
