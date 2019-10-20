using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.General
{
    public class FeaturedGym
    {
        public int GymId { get; set; }
        public string GymName { get; set; }
        public string ImageUrl { get; set; }
        public string Location { get; set; }
    }

    public class FeaturedCoach
    {
        public string CoachName { get; set; }
        public string ImageUrl { get; set; }
        public int CoachId { get; set; }
        public string Location { get; set; }
    }
}
