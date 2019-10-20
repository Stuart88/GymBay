using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class CountryGeo
    {
        public int CountryGeonameId { get; set; }
        public string CountryName { get; set; }
        public string ContinentName { get; set; }
        public string LocaleCode { get; set; }
        public string ContinentCode { get; set; }
        public string IsoCode { get; set; }
        public string Iso3Code { get; set; }
        public string TimeZone { get; set; }
        public string Currency { get; set; }
        public int Id { get; set; }
    }
}
