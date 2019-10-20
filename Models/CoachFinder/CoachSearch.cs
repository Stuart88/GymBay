using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.CoachFinder
{
    public class CoachSearch
    {
        public int Page { get; set; }
        public string Keywords { get; set; }
        public int? CityID { get; set; }
        public int? AverageRating { get; set; }
        public int? IsVerfied { get; set; }
        public int? CoachBodybuilding { get; set; }
        public int? CoachClasses { get; set; }
        public int? CoachCrossfit { get; set; }
        public int? CoachDance { get; set; }
        public int? CoachMasseuse { get; set; }
        public int? CoachNutrition { get; set; }
        public int? CoachOlympicLifting { get; set; }
        public int? CoachOneOnOne { get; set; }
        public int? CoachOnlineAvailable { get; set; }
        public int? CoachOnlineOnly { get; set; }
        public int? CoachPhysio { get; set; }
        public int? CoachPowerlifting { get; set; }
        public int? CoachProgramOnly { get; set; }
        public int? CoachWeightLoss { get; set; }
        public int? CoachStrongman { get; set; }
        public int? CoachOther { get; set; }
        public bool IsAdmin { get; set; }
        public int Status { get; set; }
    }
}
