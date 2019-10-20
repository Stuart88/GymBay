namespace GymBay.Models.DbClasses
{
    public partial class CityGeo
    {
        #region Public Properties

        public string CityName { get; set; }
        public string ContinentCode { get; set; }
        public string ContinentName { get; set; }
        public int? CountryGeonameId { get; set; }
        public string CountryName { get; set; }
        public int GeonameId { get; set; }
        public int Id { get; set; }
        public string IsoCode { get; set; }
        public double? Latitude { get; set; }
        public string LocaleCode { get; set; }
        public double? Longitude { get; set; }
        public string TimeZone { get; set; }

        #endregion Public Properties
    }
}