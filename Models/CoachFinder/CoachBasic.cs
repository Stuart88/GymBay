using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.CoachFinder
{
    public class CoachBasic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string Pic { get; set; }
        public int? IsVerified { get; set; }
    }
}
