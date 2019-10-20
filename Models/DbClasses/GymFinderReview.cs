using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class GymFinderReview
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedData { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int GymFinderGymId { get; set; }
        public string ReviewName { get; set; }
        public int ReviewerId { get; set; }
        public int Rating { get; set; }
    }
}
