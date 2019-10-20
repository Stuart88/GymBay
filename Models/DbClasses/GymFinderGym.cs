using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class GymFinderGym
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string StreetAddress { get; set; }
        public string ImageLocation1 { get; set; }
        public string ImageLocation2 { get; set; }
        public string ImageLocation3 { get; set; }
        public double? AverageRating { get; set; }
        public int? Powerlifting { get; set; }
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
        public int? Other { get; set; }
        public int LocationCityId { get; set; }
        public int LocationCountryId { get; set; }
        public double LocationLat { get; set; }
        public double LocationLong { get; set; }
        public int? OwnerId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string Phone { get; set; }
        public string Website { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
        public string Instagram { get; set; }
        public string LocationCityName { get; set; }
        public string LocationCountryName { get; set; }
        public string ImageLocationLogo { get; set; }
        public int Status { get; set; }
        public int? Lockers { get; set; }
        public int? Strongman { get; set; }
        public string Whatsapp { get; set; }
        public string Linkedin { get; set; }
        public string GooglePlus { get; set; }
        public string Snapchat { get; set; }
        public string Skype { get; set; }
        public string Youtube { get; set; }
        public int? Featured { get; set; }
    }
}
