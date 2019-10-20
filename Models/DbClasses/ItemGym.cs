using System;
using System.Collections.Generic;
using GeoAPI.Geometries;

namespace GymBay.Models.DbClasses
{
    public partial class ItemGym
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public string Description { get; set; }
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
        public IGeometry LocationGeo { get; set; }
        public int SellerId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
