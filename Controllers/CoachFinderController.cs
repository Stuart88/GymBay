using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.CoachFinder;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using ImageMagick;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NetTopologySuite;

namespace GymBay.Controllers
{
    [Route("api/CoachFinder")]
    public class CoachFinderController : Controller
    {
        readonly GymBayContext db = new GymBayContext();
       

        [HttpPost("Search")]
        public async Task<HttpResult> Search([FromBody] CoachSearch q)
        {

            try
            {
                int takeAmount = 15;
                int pageNum = q.Page;

                

                string k = q.Keywords.ToLower().Trim();


                List<string> queryWords = k.Replace(',', ' ').Split(' ').Where(x => x.Length > 0).ToList();


                var coaches = (from u in db.User
                            //let citySearch = city.Id > 0
                            where
                            (
                             u.IsCoach == 1
                           &&
                            (u.Status == q.Status || q.Status == (int)Enums.UserStatus.Active)
                            &&
                            (
                              string.IsNullOrEmpty(k)
                              || queryWords.Any(w => u.FirstName.ToLower().Contains(w))
                              || queryWords.Any(w => u.LastName.ToLower().Contains(w))
                              || queryWords.Any(w => u.CityName.ToLower().Contains(w))
                              || queryWords.Any(w => u.CountryName.ToLower().Contains(w))
                              || queryWords.All(w => u.CoachBio.ToLower().Contains(w))
                            )
                            &&
                            (u.IsVerified == q.IsVerfied || q.IsVerfied!= 1)
                            &&
                            (u.CoachBodybuilding == q.CoachBodybuilding|| q.CoachBodybuilding!= 1)
                            &&
                            (u.CoachClasses == q.CoachClasses || q.CoachClasses != 1)
                            &&
                            (u.CoachCrossfit == q.CoachCrossfit || q.CoachCrossfit != 1)
                            &&                 
                            (u.CoachDance == q.CoachDance || q.CoachDance != 1)
                            &&                 
                            (u.CoachMasseuse == q.CoachMasseuse || q.CoachMasseuse != 1)
                            &&                 
                            (u.CoachNutrition == q.CoachNutrition || q.CoachNutrition != 1)
                            &&                 
                            (u.CoachOlympicLifting == q.CoachOlympicLifting || q.CoachOlympicLifting != 1)
                            &&                 
                            (u.CoachOneOnOne == q.CoachOneOnOne || q.CoachOneOnOne != 1)
                            &&                 
                            (u.CoachOnlineAvailable == q.CoachOnlineAvailable || q.CoachOnlineAvailable != 1)
                            &&
                            (u.CoachOnlineOnly == q.CoachOnlineOnly || q.CoachOnlineOnly != 1)
                            &&
                            (u.CoachOther== q.CoachOther || q.CoachOther != 1)
                             &&
                            (u.CoachPhysio == q.CoachPhysio || q.CoachPhysio != 1)
                             &&
                            (u.CoachPowerlifting == q.CoachPowerlifting || q.CoachPowerlifting != 1)
                             &&
                            (u.CoachProgramOnly == q.CoachProgramOnly || q.CoachProgramOnly != 1)
                            &&
                            (u.CoachStrongman == q.CoachStrongman || q.CoachStrongman != 1)
                            &&
                            (u.CoachWeightLoss == q.CoachWeightLoss || q.CoachWeightLoss != 1)
                           
                            )
                            select u);



                int total = coaches.Count();


                CityGeo city = await db.CityGeo.FindAsync(q.CityID);


                if (city != null)
                {//sort by distance first if city selected

                    GeoAPI.Geometries.IGeometryFactory geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
                    GeoAPI.Geometries.IPoint cityLocation = geometryFactory.CreatePoint(new GeoAPI.Geometries.Coordinate((double)city.Latitude, (double)city.Longitude));


                    coaches = coaches.Where(x => x.Latitude.HasValue )
                        .OrderBy(x => new GeoAPI.Geometries.Coordinate(x.Latitude.Value, x.Longitutde.Value).Distance(cityLocation.Coordinate))
                        .ThenByDescending(x => x.CreationDate);


                }
                else if(!string.IsNullOrEmpty(k))
                {//else sort by keyword relevance only


                    coaches = coaches
                        .OrderByDescending(x => !string.IsNullOrEmpty(x.FirstName) && x.FirstName.ToLower().StartsWith(k))
                        .ThenByDescending(x => x.CreationDate);

                }
                else
                {//else sort by rating
                    coaches = coaches.OrderByDescending(x => x.AverageRating);
                }


                coaches = coaches.Skip(pageNum * takeAmount).Take(takeAmount);


                if (coaches.Count() == 0)
                {
                    return new HttpResult(true, new { coaches = new List<UserPublic>(), total }, "");
                }
                else
                {
                    return new HttpResult(true, new { coaches = coaches.Where(x => x != null).AsEnumerable().Select(s => new UserPublic(s, false)).ToList(), total }, "");
                }
            }
            catch (Exception e)
            {
                var rawData = db.User.ToList();
                return new HttpResult(false, null, Functions.ErrorMessage(e));

            }

        }

       

        [HttpGet("QuickSearch")]
        public IEnumerable<CoachBasic> QuickSearch([FromQuery] string q)
       {
            if (!string.IsNullOrEmpty(q))
            {
                q = q.ToLower().Trim();

                List<string> queryWords = q.Replace(',', ' ').Split(' ').Where(x => x.Length > 0).ToList();



                IQueryable<CoachBasic> coaches = (from u in db.User
                                                   where (u.Status == (int)Enums.UserStatus.Active)
                                                   && u.IsCoach == 1
                                                   && (
                                                     string.IsNullOrEmpty(q)
                                                     || queryWords.Any(w => u.FirstName.ToLower().Contains(w))
                                                     || queryWords.Any(w => u.LastName.ToLower().Contains(w))
                                                     || queryWords.Any(w => u.CityName.ToLower().Contains(w))
                                                     || queryWords.Any(w => u.CountryName.ToLower().Contains(w))
                                                     )
                                                   select new CoachBasic
                                                   {
                                                       Id = u.Id,
                                                       CityName = u.CityName,
                                                       CountryName = u.CountryName,
                                                       Name = u.FirstName + " " + u.LastName,
                                                       Pic = u.ProfilePic,
                                                       IsVerified = u.IsVerified
                                                   })
                                                   .OrderByDescending(x => x.Name.ToLower()
                                                   .StartsWith(q))
                                                   .Take(20);
                return coaches;

            }
            else
            {
                return new List<CoachBasic>();

            }
        }


        [HttpPost("ToggleFeatured/{coachID}")]
        public async Task<HttpResult> ToggleFeatured([FromRoute] int coachID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                User updating = db.User.Find(coachID);
                if (updating == null)
                    throw new Exception("No coach found!");


                updating.FeaturedCoach = updating.FeaturedCoach == (int)Enums.FeaturedState.NotFeatured ? (int)Enums.FeaturedState.Featured : (int)Enums.FeaturedState.NotFeatured;
                updating.ModifedDate = DateTime.Now;

                db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                await db.SaveChangesAsync();


                return new HttpResult(true, updating.FeaturedCoach == (int)Enums.FeaturedState.Featured, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        [HttpGet("GetFeaturedCoaches")]
        public HttpResult GetFeaturedCoaches()
        {
            try
            {
                IEnumerable<FeaturedCoach> featured = db.User.Where(x => x.IsCoach == 1 && x.FeaturedCoach == 1)
                    .AsEnumerable()
                    .Select(c => new FeaturedCoach
                    {
                        CoachId = c.Id,
                        CoachName = string.Format("{0} {1}", c.FirstName, c.LastName),
                        Location = string.Format("{0}, {1}", c.CityName, c.CountryName),
                        ImageUrl = string.IsNullOrEmpty(c.ProfilePic)
                        ? "/dist/images/coachfinder/default-coach.jpg"
                        : c.ProfilePic
                    });
                return new HttpResult(true, featured, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }


        [HttpPost("ToggleVerifiedStatus/{userID}")]
        public async Task<HttpResult> ToggleGymStatus([FromRoute] int userID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                User updating = db.User.Find(userID);
                if (updating == null)
                    throw new Exception("No gym found!");


                updating.IsVerified = updating.IsVerified == (int)Enums.VerifiedSatus.Verfifed? (int)Enums.VerifiedSatus.NotVerified: (int)Enums.VerifiedSatus.Verfifed;
                updating.ModifedDate = DateTime.Now;

                db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                await db.SaveChangesAsync();
               

                return new HttpResult(true, updating.IsVerified == (int)Enums.VerifiedSatus.Verfifed, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

      
    }
}
