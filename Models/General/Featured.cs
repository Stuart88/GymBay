namespace GymBay.Models.General
{
    public class FeaturedCoach
    {
        #region Public Properties

        public int CoachId { get; set; }
        public string CoachName { get; set; }
        public string ImageUrl { get; set; }
        public string Location { get; set; }

        #endregion Public Properties
    }

    public class FeaturedGym
    {
        #region Public Properties

        public int GymId { get; set; }
        public string GymName { get; set; }
        public string ImageUrl { get; set; }
        public string Location { get; set; }

        #endregion Public Properties
    }
}