using GymBay.Models.DbClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.Reviews
{
    public class CoachReviewPublic
    {
        public CoachReview Review { get; set; }
        public string ReviewerName { get; set; }
        public string ReviewerPic { get; set; }
        public string Upvotes { get; set; }
    }
}
