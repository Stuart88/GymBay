using GymBay.Models.DbClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.Geo
{
    public class CitySearchResult
    {
        public int CityID { get; set; }
        public string CityName { get; set; }
        public string NearestCity { get; set; } 
    }
}
