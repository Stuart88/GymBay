using GymBay.Models.DbClasses;

namespace GymBay.Models.Reviews
{
    public class GymReviewPublic
    {
        #region Public Properties

        public GymReview Review { get; set; }
        public string ReviewerName { get; set; }
        public string ReviewerPic { get; set; }
        public string Upvotes { get; set; }

        #endregion Public Properties
    }
}