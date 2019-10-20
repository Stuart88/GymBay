namespace GymBay.Models.DbClasses
{
    public partial class CityGeoBasic
    {
        #region Public Properties

        public int CityGeoId { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public int Id { get; set; }
        public string NearestCity { get; set; }

        #endregion Public Properties
    }
}