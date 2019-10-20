using GymBay.Models.DbClasses;

namespace GymBay.Models.Reviews
{
    public class CoachReviewPublic
    {
        #region Public Properties

        public CoachReview Review { get; set; }
        public string ReviewerName { get; set; }
        public string ReviewerPic { get; set; }
        public string Upvotes { get; set; }

        #endregion Public Properties
    }
}