using System;

namespace GymBay.Models.DbClasses
{
    public partial class User
    {
        #region Public Properties

        public int? AdminId { get; set; }
        public double? AverageRating { get; set; }
        public string Bio { get; set; }
        public int? BodyBuilding { get; set; }
        public int? Boxing { get; set; }
        public int? Calisthenics { get; set; }
        public int? CityId { get; set; }
        public string CityName { get; set; }
        public string CoachBio { get; set; }
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
        public int? CoachOther { get; set; }
        public int? CoachPhysio { get; set; }
        public int? CoachPowerlifting { get; set; }
        public int? CoachProgramOnly { get; set; }
        public int? CoachStrongman { get; set; }
        public int? CoachWeightLoss { get; set; }
        public int? CountryId { get; set; }
        public string CountryName { get; set; }
        public DateTime CreationDate { get; set; }
        public int? Crossfit { get; set; }
        public string Email { get; set; }
        public int? Endurance { get; set; }
        public string Facebook { get; set; }
        public int? FeaturedCoach { get; set; }
        public string FirstName { get; set; }
        public string GooglePlus { get; set; }
        public int? Gymnastics { get; set; }
        public int Id { get; set; }
        public string Instagram { get; set; }
        public int? IsCoach { get; set; }
        public int? IsVerified { get; set; }
        public int? Kickboxing { get; set; }
        public string LastName { get; set; }
        public double? Latitude { get; set; }
        public string Linkedin { get; set; }
        public double? Longitutde { get; set; }
        public int? Mma { get; set; }
        public DateTime ModifedDate { get; set; }
        public string Phone { get; set; }
        public int? Powerlifting { get; set; }
        public string ProfilePic { get; set; }
        public string SessionToken { get; set; }
        public int? ShopId { get; set; }
        public string Skype { get; set; }
        public string Snapchat { get; set; }
        public int? Status { get; set; }
        public int? StrongManWoman { get; set; }
        public string Twitter { get; set; }
        public string Username { get; set; }
        public string Website { get; set; }
        public int? WeightLifting { get; set; }
        public string Whatsapp { get; set; }
        public string Youtube { get; set; }

        #endregion Public Properties
    }
}