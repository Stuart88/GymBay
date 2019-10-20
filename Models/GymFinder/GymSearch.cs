using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.GymFinder
{
    public class GymSearch
    {
        public int Page { get; set; }
        public string Keywords { get; set; }
        public int? CityID { get; set; }
        public int? AverageRating { get; set; }
        public int Powerlifting { get; set; }
        public int? Crossfit { get; set; }
        public int? OlympicLifting { get; set; }
        public int? FreeWeightsDumbbells { get; set; }
        public int? FreeWeightsBarsPlates { get; set; }
        public int? ResistanceMachines { get; set; }
        public int? CardioMachines { get; set; }
        public int? Cafe { get; set; }
        public int? VendingMachine { get; set; }
        public int? TwentyFourHour { get; set; }
        public int? Toilets { get; set; }
        public int? ChangingRooms { get; set; }
        public int? ClassesAvailable { get; set; }
        public int? MembersOnly { get; set; }
        public int? NoMembershipRequired { get; set; }
        public int? Sauna { get; set; }
        public int? SwimmingPool { get; set; }
        public int? Physio { get; set; }
        public int? Strongman { get; set; }
        public int? Lockers { get; set; }

        public bool IsAdmin { get; set; }
        public int Status { get; set; }
    }
}
