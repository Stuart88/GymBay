using GymBay.Models.DbClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.General
{
    public class UserPublic
    {
        public UserPublic() { }
        public UserPublic(User user, bool includeEmail)
        {
            Id = user.Id;
            CreationDate = user.CreationDate;
            ModifedDate = user.ModifedDate;
            Email = includeEmail ? user.Email : null;
            ShopId = user.ShopId;
            Username = user.Username;
            CityId = user.CityId;
            CountryId = user.CountryId;
            IsCoach = user.IsCoach;
            IsVerified = user.IsVerified;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Bio = user.Bio;
            CityName = user.CityName;
            CountryName = user.CountryName;
            Phone = user.Phone;
            Facebook = user.Facebook;
            Twitter = user.Twitter;
            Instagram = user.Instagram;
            Youtube = user.Youtube;
            CoachBio = user.CoachBio;
            BodyBuilding = user.BodyBuilding;
            Powerlifting = user.Powerlifting;
            Crossfit = user.Crossfit;
            WeightLifting = user.WeightLifting;
            StrongManWoman = user.StrongManWoman;
            Calisthenics = user.Calisthenics;
            Boxing = user.Boxing;
            Kickboxing = user.Kickboxing;
            Mma = user.Mma;
            Endurance = user.Endurance;
            Gymnastics = user.Gymnastics;
            ProfilePic = user.ProfilePic;
            Latitude = user.Latitude;
            Longitude = user.Longitutde;
            AverageRating = user.AverageRating;
            CoachBodybuilding = user.CoachBodybuilding;
            CoachClasses = user.CoachClasses;
            CoachCrossfit = user.CoachCrossfit;
            CoachDance = user.CoachDance;
            CoachNutrition = user.CoachNutrition;
            CoachMasseuse = user.CoachMasseuse;
            CoachOlympicLifting = user.CoachOlympicLifting;
            CoachOneOnOne = user.CoachOneOnOne;
            CoachOnlineAvailable = user.CoachOnlineAvailable;
            CoachOnlineOnly = user.CoachOnlineOnly;
            CoachPhysio = user.CoachPhysio;
            CoachPowerlifting = user.CoachPowerlifting;
            CoachProgramOnly = user.CoachProgramOnly;
            CoachWeightLoss = user.CoachWeightLoss;
            CoachStrongman = user.CoachStrongman;
            CoachOther = user.CoachOther;
            Whatsapp = user.Whatsapp;
            Linkedin = user.Linkedin;
            GooglePlus = user.GooglePlus;
            Snapchat = user.Snapchat;
            Skype = user.Skype;
            Website = user.Website;
            FeaturedCoach = user.FeaturedCoach;
        } 
        public int Id { get; set; }
        public string Email { get; set; }
        public int? ShopId { get; set; }
        public string Username { get; set; }
        public int? CityId { get; set; }
        public int? CountryId { get; set; }
        public int? IsCoach { get; set; }
        public int? IsVerified { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string Phone { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
        public string Youtube { get; set; }
        public string Instagram { get; set; }
        public string CoachBio { get; set; }
        public int? BodyBuilding { get; set; }
        public int? Powerlifting { get; set; }
        public int? Crossfit { get; set; }
        public int? WeightLifting { get; set; }
        public int? StrongManWoman { get; set; }
        public int? Calisthenics { get; set; }
        public int? Boxing { get; set; }
        public int? Kickboxing { get; set; }
        public int? Mma { get; set; }
        public int? Endurance { get; set; }
        public int? Gymnastics { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifedDate { get; set; }
        public string ProfilePic { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? AverageRating { get; set; }
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
        public string Whatsapp { get; set; }
        public string Linkedin { get; set; }
        public string GooglePlus { get; set; }
        public string Snapchat { get; set; }
        public string Skype { get; set; }
        public string Website { get; set; }
        public int? FeaturedCoach { get; set; }
    }
}
