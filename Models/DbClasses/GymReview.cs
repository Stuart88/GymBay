using System;

namespace GymBay.Models.DbClasses
{
    public partial class GymReview
    {
        #region Public Properties

        public string BadPoints { get; set; }
        public DateTime CreationDate { get; set; }
        public string GoodPoints { get; set; }
        public int GymId { get; set; }
        public int Id { get; set; }
        public string MainReview { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int Rating { get; set; }
        public int ReviewerId { get; set; }
        public string Title { get; set; }
        public string Upvotes { get; set; }

        #endregion Public Properties
    }
}