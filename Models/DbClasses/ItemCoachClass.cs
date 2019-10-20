using System;
using System.Collections.Generic;
using GeoAPI.Geometries;

namespace GymBay.Models.DbClasses
{
    public partial class ItemCoachClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryPathName { get; set; }
        public string Description { get; set; }
        public int OneOnOne { get; set; }
        public int? OnlineProgramming { get; set; }
        public int? OnlineCoaching { get; set; }
        public int? SetPrograms { get; set; }
        public int? NutritionCoach { get; set; }
        public int? SetDietPlans { get; set; }
        public int? Powerlifting { get; set; }
        public int? Crossfit { get; set; }
        public int? WeightLifting { get; set; }
        public int? Spinning { get; set; }
        public int? WeightLoss { get; set; }
        public int? Boxing { get; set; }
        public int? Mma { get; set; }
        public int? MartialArts { get; set; }
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
