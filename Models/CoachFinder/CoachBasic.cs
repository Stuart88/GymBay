namespace GymBay.Models.CoachFinder
{
    public class CoachBasic
    {
        #region Public Properties

        public string CityName { get; set; }
        public string CountryName { get; set; }
        public int Id { get; set; }
        public int? IsVerified { get; set; }
        public string Name { get; set; }
        public string Pic { get; set; }

        #endregion Public Properties
    }
}