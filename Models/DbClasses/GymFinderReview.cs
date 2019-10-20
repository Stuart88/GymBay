using System;

namespace GymBay.Models.DbClasses
{
    public partial class GymFinderReview
    {
        #region Public Properties

        public DateTime CreationDate { get; set; }
        public string Description { get; set; }
        public int GymFinderGymId { get; set; }
        public int Id { get; set; }
        public DateTime ModifiedData { get; set; }
        public int Rating { get; set; }
        public int ReviewerId { get; set; }
        public string ReviewName { get; set; }
        public string Title { get; set; }

        #endregion Public Properties
    }
}