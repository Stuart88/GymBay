using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class CityGeo
    {
        public int GeonameId { get; set; }
        public int? CountryGeonameId { get; set; }
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string ContinentName { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string LocaleCode { get; set; }
        public string ContinentCode { get; set; }
        public string IsoCode { get; set; }
        public string TimeZone { get; set; }
        public int Id { get; set; }
    }
}
