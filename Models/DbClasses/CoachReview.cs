using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class CoachReview
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int CoachId { get; set; }
        public int ReviewerId { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; }
        public string MainReview { get; set; }
        public string GoodPoints { get; set; }
        public string BadPoints { get; set; }
        public string Upvotes { get; set; }
    }
}
