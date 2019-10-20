using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class CityGeoBasic
    {
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string NearestCity { get; set; }
        public int Id { get; set; }
        public int CityGeoId { get; set; }
    }
}
