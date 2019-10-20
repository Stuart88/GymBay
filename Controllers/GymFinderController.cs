using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using GymBay.Models.GymFinder;
using ImageMagick;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NetTopologySuite;

namespace GymBay.Controllers
{
    [Route("api/GymFinder")]
    public class GymFinderController : Controller
    {
        readonly GymBayContext db = new GymBayContext();
       

        [HttpPost("Search")]
        public async Task<HttpResult> Search([FromBody] GymSearch q)
        {
            try
            {
                
                int takeAmount = 10;
                int pageNum = q.Page;

                string k = q.Keywords.ToLower().Trim();
                //if (string.IsNullOrEmpty(k))
                //    k = " ";
                ////for some reason search takes less time if given keyword is not empty...

                List<string> queryWords = k.Replace(',', ' ').Split(' ').Where(x => x.Length > 0).ToList();

               

                IQueryable<GymFinderGym> gyms = (from g in db.GymFinderGym
                            //let citySearch = city.Id > 0
                            where
                            (
                            (g.Status == q.Status || q.Status == (int)Enums.GymStatus.Any)
                            &&
                            (
                              string.IsNullOrEmpty(k)
                              || queryWords.Any(w => g.Name.ToLower().Contains(w))
                              || queryWords.Any(w => g.StreetAddress.ToLower().Contains(w))
                              || queryWords.Any(w => g.LocationCityName.ToLower().Contains(w))
                              || queryWords.Any(w => g.LocationCountryName.ToLower().Contains(w))
                              || queryWords.All(w => g.Description.ToLower().Contains(w))
                            )
                            //&&
                            //(
                            //      q.CityID == city.Id || !citySearch
                            //)
                            &&
                            (q.Cafe == g.Cafe || q.Cafe != 1)
                            &&
                            (q.CardioMachines == g.CardioMachines || q.CardioMachines != 1)
                            &&
                            (q.ChangingRooms == g.ChangingRooms || q.ChangingRooms != 1)
                            &&
                            (q.ClassesAvailable == g.ClassesAvailable || q.ClassesAvailable != 1)
                            &&
                            (q.Crossfit == g.Crossfit || q.Crossfit != 1)
                            &&
                            (q.FreeWeightsBarsPlates == g.FreeWeightsBarsPlates || q.FreeWeightsBarsPlates != 1)
                            &&
                            (q.FreeWeightsDumbbells == g.FreeWeightsDumbbells || q.FreeWeightsDumbbells != 1)
                            &&
                            (q.MembersOnly == g.MembersOnly || q.MembersOnly != 1)
                            &&
                            (q.NoMembershipRequired == g.NoMembershipRequired || q.NoMembershipRequired != 1)
                            &&
                            (q.OlympicLifting == g.OlympicLifting || q.OlympicLifting != 1)
                            &&
                            (q.Physio == g.Physio || q.Physio != 1)
                            &&
                            (q.Powerlifting == g.Powerlifting || q.Powerlifting != 1)
                            &&
                            (q.ResistanceMachines == g.ResistanceMachines || q.ResistanceMachines != 1)
                            &&
                            (q.Sauna == g.Sauna || q.Sauna != 1)
                            &&
                            (q.SwimmingPool == g.SwimmingPool || q.SwimmingPool != 1)
                            &&
                            (q.Toilets == g.Toilets || q.Toilets != 1)
                            &&
                            (q.TwentyFourHour == g.TwentyFourHour || q.TwentyFourHour != 1)
                            &&
                            (q.VendingMachine == g.VendingMachine || q.VendingMachine != 1)
                             &&
                            (q.Strongman == g.Strongman || q.Strongman != 1)
                             &&
                            (q.Lockers == g.Lockers || q.Lockers != 1)
                            )
                            select g);


                int total = gyms.Count();

                CityGeo city = await db.CityGeo.FindAsync(q.CityID);
                //if (city == null)
                //    city = new CityGeo { Id = 0 };

                if (city != null)
                {//sort by distance first if city selected

                    GeoAPI.Geometries.IGeometryFactory geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
                    GeoAPI.Geometries.IPoint cityLocation = geometryFactory.CreatePoint(new GeoAPI.Geometries.Coordinate((double)city.Latitude, (double)city.Longitude));

                    gyms = gyms
                        .OrderBy(x => new GeoAPI.Geometries.Coordinate(x.LocationLat, x.LocationLong).Distance(cityLocation.Coordinate))
                        .ThenByDescending(x => x.CreationDate);
                              
                }
                else if(!string.IsNullOrEmpty(k))
                {//else sort by keyword relevance only

                    gyms = gyms
                        .OrderByDescending(x => x.Name.ToLower().StartsWith(k))
                        .ThenByDescending(x => x.CreationDate);
                }
                else
                {//else sort by rating

                    gyms = gyms.OrderByDescending(x => x.AverageRating);
                }

                gyms = gyms.Skip(pageNum * takeAmount).Take(takeAmount);

                return new HttpResult(true, new { gyms, total }, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));

            }

        }

        [HttpGet("GetGym")]
        public HttpResult GetGym([FromQuery]int gymID)
        {
            try
            {

                var gym = db.GymFinderGym.Find(gymID);

                if (gym == null)
                    throw new Exception("No gym found.");


                return new HttpResult(true, gym, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));

            }

        }

        [HttpGet("GetMyGym")]
        public HttpResult GetMyGym()
        {
            try
            {
                if (!Functions.UserLoggedIn(Request, out User thisUser))
                    throw new Exception("Not logged in.");

                var gym = db.GymFinderGym.FirstOrDefault(x => x.OwnerId == thisUser.Id);

                if (gym == null)
                    throw new Exception("No gym found.");


                return new HttpResult(true, gym, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, new GymFinderGym(), Functions.ErrorMessage(e));

            }

        }

        [HttpGet("QuickSearch")]
        public IEnumerable<GymFinderBasic> QuickSearch([FromQuery] string q)
        {
            if (!string.IsNullOrEmpty(q))
            {
                q = q.ToLower().Trim();

                List<string> queryWords = q.Replace(',', ' ').Split(' ').Where(x => x.Length > 0).ToList();



                IQueryable<GymFinderBasic> gyms = (from g in db.GymFinderGym
                                                   where (g.Status == (int)Enums.GymStatus.Live)
                                                   && (
                                                     string.IsNullOrEmpty(q)
                                                     || queryWords.Any(w => g.Name.ToLower().Contains(w))
                                                     || queryWords.Any(w => g.StreetAddress.ToLower().Contains(w))
                                                     || queryWords.Any(w => g.LocationCityName.ToLower().Contains(w))
                                                     || queryWords.Any(w => g.LocationCountryName.ToLower().Contains(w))
                                                     )
                                                   select new GymFinderBasic
                                                   {
                                                       Id = g.Id,
                                                       CityName = g.LocationCityName,
                                                       CountryName = g.LocationCountryName,
                                                       Name = g.Name,
                                                       Logo = g.ImageLocationLogo
                                                   })
                                                   .OrderByDescending(x => x.Name.ToLower()
                                                   .StartsWith(q))
                                                   .Take(20);
                return gyms;

            }
            else
            {
                return new List<GymFinderBasic>();

            }
        }

        [HttpGet("GetAllGyms")]
        public IEnumerable<GymFinderBasic> GetAllGyms()
        {

            IQueryable<GymFinderBasic> gyms = (from g in db.GymFinderGym
                                               where (g.Status == (int)Enums.GymStatus.Live)
                                               select new GymFinderBasic
                                               {
                                                   Id = g.Id,
                                                   CityName = g.LocationCityName,
                                                   CountryName = g.LocationCountryName,
                                                   Name = g.Name,
                                                   Logo = g.ImageLocationLogo
                                               })
                                               .OrderByDescending(x => x.Name.ToLower());
            return gyms;
        }


        [HttpPost("AddUpdateGymFinderGym")]
        public async Task<HttpResult> AddUpdateGymFinderGym([FromBody] GymFinderGym gym)
        {
            try
            {
                //User editor = db.User.Find(gym.OwnerId);
                bool userLoggedIn = Functions.UserLoggedIn(Request, out User editor);
                bool adminLoggedIn = Functions.AdminLoggedIn(Request, out _);

                //if ((gym.Id > 0 && !adminLoggedIn ) //gym belongs to someone
                //    && (
                //        (!adminLoggedIn && !userLoggedIn) //no user logged in
                //        || (userLoggedIn && editor.Id != gym.OwnerId) ) //or user logged in but does not own the gym
                //        )
                //{
                //    throw new Exception("Not logged in!");
                //}

                if(gym.Id > 0 && !userLoggedIn && !adminLoggedIn)
                {
                    //gym belongs to someone but no user logged in
                    throw new Exception("Not logged in!");
                }
                else if(gym.Id > 0 && !adminLoggedIn && userLoggedIn && editor.Id != gym.OwnerId)
                {
                    //user is not admin, and gym does not belong to this user
                    throw new Exception("Not logged in!");
                }
                //all okay, gym belongs to user, or user is admin.


                DateTime now = DateTime.Now;
                CityGeo city = db.CityGeo.Find(gym.LocationCityId);
                gym.LocationCountryId = db.CountryGeo.FirstOrDefault(x => x.CountryName == city.CountryName).Id;

                if (gym.Id > 1)
                {
                    GymFinderGym updating = db.GymFinderGym.Find(gym.Id);
                    Functions.CheckNull(updating);

                    if (!string.IsNullOrEmpty(gym.Website) && gym.Website.StartsWith("www"))
                    {
                        gym.Website = "https://" + gym.Website;
                    }
                    if (!string.IsNullOrEmpty(gym.Youtube) && gym.Youtube.StartsWith("www"))
                    {
                        gym.Youtube = "https://" + gym.Youtube;
                    }
                    if (!string.IsNullOrEmpty(gym.Facebook) && gym.Facebook.StartsWith("www"))
                    {
                        gym.Facebook = "https://" + gym.Facebook;
                    }
                    if (!string.IsNullOrEmpty(gym.Twitter) && gym.Twitter.StartsWith("www"))
                    {
                        gym.Twitter = "https://" + gym.Twitter;
                    }
                    if (!string.IsNullOrEmpty(gym.Instagram) && gym.Instagram.StartsWith("www"))
                    {
                        gym.Instagram = "https://" + gym.Instagram;
                    }
                    if (!string.IsNullOrEmpty(gym.Linkedin) && gym.Linkedin.StartsWith("www"))
                    {
                        gym.Linkedin = "https://" + gym.Instagram;
                    }


                    updating.Phone = gym.Phone;
                    updating.Website = gym.Website;
                    updating.Facebook = gym.Facebook;
                    updating.Twitter = gym.Twitter;
                    updating.Instagram = gym.Instagram;
                    updating.AverageRating = gym.AverageRating;
                    updating.Cafe = gym.Cafe;
                    updating.CardioMachines = gym.CardioMachines;
                    updating.ChangingRooms = gym.ChangingRooms;
                    updating.ClassesAvailable = gym.ClassesAvailable;
                    updating.Crossfit = gym.Crossfit;
                    updating.Description = gym.Description;
                    updating.FreeWeightsBarsPlates = gym.FreeWeightsBarsPlates;
                    updating.FreeWeightsDumbbells = gym.FreeWeightsDumbbells;
                    updating.LocationCityId = gym.LocationCityId;
                    updating.LocationCountryId = gym.LocationCountryId;
                    updating.LocationLat = (double)city.Latitude;
                    updating.LocationLong = (double)city.Longitude;
                    updating.MembersOnly = gym.MembersOnly;
                    updating.Name = gym.Name;
                    updating.NoMembershipRequired = gym.NoMembershipRequired;
                    updating.OlympicLifting = gym.OlympicLifting;
                    updating.Other = gym.Other;
                    updating.Physio = gym.Physio;
                    updating.Powerlifting = gym.Powerlifting;
                    updating.ResistanceMachines = gym.ResistanceMachines;
                    updating.Sauna = gym.Sauna;
                    updating.OwnerId = gym.OwnerId;
                    updating.StreetAddress = gym.StreetAddress;
                    updating.SwimmingPool = gym.SwimmingPool;
                    updating.Toilets = gym.Toilets;
                    updating.Lockers = gym.Lockers;
                    updating.Strongman = gym.Strongman;
                    updating.TwentyFourHour = gym.TwentyFourHour;
                    updating.VendingMachine = gym.VendingMachine;
                    updating.LocationCityName = city.CityName;
                    updating.LocationCountryName = city.CountryName;
                    updating.Status = gym.Status;
                    updating.ModifiedDate = now;
                    updating.Whatsapp = gym.Whatsapp;
                    updating.Linkedin = gym.Linkedin;
                    updating.GooglePlus = gym.GooglePlus;
                    updating.Snapchat = gym.Snapchat;
                    updating.Skype = gym.Skype;
                    updating.Youtube = gym.Youtube;


                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();
                }
                else
                {
                    gym.CreationDate = now;
                    gym.ModifiedDate = now;
                    gym.LocationLat = (double)city.Latitude;
                    gym.LocationLong = (double)city.Longitude;
                    gym.LocationCityName = city.CityName;
                    gym.LocationCountryName = city.CountryName;
                    gym.Status = (int)Enums.GymStatus.Pending;
                    gym.AverageRating = 5d;

                    db.GymFinderGym.Add(gym);

                    await db.SaveChangesAsync();

                   
                }

                return new HttpResult(true, gym, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        [HttpPost("ToggleGymStatus/{gymID}")]
        public async Task<HttpResult> ToggleGymStatus([FromRoute] int gymID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                GymFinderGym updating = db.GymFinderGym.Find(gymID);
                if (updating == null)
                    throw new Exception("No gym found!");


                updating.Status = updating.Status == (int)Enums.GymStatus.Live ? (int)Enums.GymStatus.Pending : (int)Enums.GymStatus.Live;
                updating.ModifiedDate = DateTime.Now;

                db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                await db.SaveChangesAsync();
               

                return new HttpResult(true, updating.Status == (int)Enums.GymStatus.Live, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        [HttpPost("ToggleFeatured/{gymID}")]
        public async Task<HttpResult> ToggleFeatured([FromRoute] int gymID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                GymFinderGym updating = db.GymFinderGym.Find(gymID);
                if (updating == null)
                    throw new Exception("No gym found!");


                updating.Featured = updating.Featured == (int)Enums.FeaturedState.NotFeatured ? (int)Enums.FeaturedState.Featured: (int)Enums.FeaturedState.NotFeatured;
                updating.ModifiedDate = DateTime.Now;

                db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                await db.SaveChangesAsync();


                return new HttpResult(true, updating.Featured == (int)Enums.FeaturedState.Featured, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        [HttpGet("GetFeaturedGyms")]
        public HttpResult GetFeaturedGyms()
        {
            try
            {
                IEnumerable<FeaturedGym> featured = db.GymFinderGym.Where(x => x.Featured == 1)
                    .AsEnumerable()
                    .Select(gym => new FeaturedGym {
                        GymId = gym.Id,
                        GymName = gym.Name,
                        Location = string.Format("{0}, {1}", gym.LocationCityName, gym.LocationCountryName),
                        ImageUrl = string.IsNullOrEmpty(gym.ImageLocationLogo)
                        ? "/dist/images/gymfinder/default-gym.svg"
                        : gym.ImageLocationLogo
                    });
                return new HttpResult(true, featured, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("AddUpdateGymImages")]
       public async Task<HttpResult> AddUpdateGymImages([FromQuery] int gymID)
        {
            GymFinderGym gym = await db.GymFinderGym.FindAsync(gymID);
            if(gym == null)
                return new HttpResult(false, null, "Gym not found!");

            if (Request.Form.Files.Count > 0)
            {
                
                try
                {
                    DateTime now = DateTime.Now;

                    string appPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "gymfinder", "gyms");


                    for (int i = 0; i < Request.Form.Files.Count(); i++)
                    {
                        var imageFile = Request.Form.Files[i];

                        List<string> currentImgLocations = new List<string>
                        {
                            gym.ImageLocation1,
                            gym.ImageLocation2,
                            gym.ImageLocation3
                        };

                        if (currentImgLocations.Any(x => !string.IsNullOrEmpty(x) && x == imageFile.Name))
                            continue;
                        //skip files that are unchanged

                        int imageNumber = i+1; // image number 1/2/3 etc matches client side image store

                        if (imageFile.Length == 0)
                        {//delete files that are gone
                            DeleteSingleGymImage(gym.Id, imageNumber);
                            switch (imageNumber)
                            {
                                case 1:
                                    gym.ImageLocation1 = string.Empty;
                                    break;
                                case 2:
                                    gym.ImageLocation2 = string.Empty;
                                    break;
                                case 3:
                                    gym.ImageLocation3 = string.Empty;
                                    break;
                            }
                            db.Entry(gym).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                            _ = await db.SaveChangesAsync();

                            continue; 
                        }


                        byte[] postedImg = Functions.ConvertToBytes(imageFile);

                        Functions.ReduceImageQuality(ref postedImg, 50000);

                        MagickImage finalImage = new MagickImage(postedImg);
                        finalImage.Format = MagickFormat.Jpg;

                        string fileName = "";

                        using (MemoryStream ms = new MemoryStream())
                        {
                            finalImage.Write(ms);

                            if (!Directory.Exists(appPath))
                            {
                                Directory.CreateDirectory(appPath);
                            }

                            fileName = string.Format("{0}_gymimage_{1}_{2}.jpg", gym.Id, imageNumber, now.Ticks);//add ticks so image name is changed upon replacement (so no issue with browser caching)
                            string filePath = Path.Combine(appPath, fileName);

                            if (System.IO.File.Exists(filePath))
                            {
                                System.IO.File.Delete(filePath);
                            }

                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                ms.Position = 0;
                                ms.CopyTo(fileStream);
                            }
                        }

                        switch (imageNumber)
                        {
                            case 1:
                                gym.ImageLocation1 = string.Format("/dist/uploads/images/gymfinder/gyms/{0}", fileName);
                                break;
                            case 2:
                                gym.ImageLocation2 = string.Format("/dist/uploads/images/gymfinder/gyms/{0}", fileName); ;
                                break;
                            case 3:
                                gym.ImageLocation3 = string.Format("/dist/uploads/images/gymfinder/gyms/{0}", fileName); ;
                                break;
                        }
                    }

                    db.Entry(gym).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    _ = await db.SaveChangesAsync();

                    //update to latest entry, otherwise logo/images may not be correct as the two upload simultaneously
                    gym = db.GymFinderGym.Find(gym.Id);
                }
                catch(Exception e)
                {
                    return new HttpResult(false, null, Functions.ErrorMessage(e));
                }


            }

            return new HttpResult(true, gym, "");
        }

        [HttpPost("AddUpdateGymLogo")]
        public async Task<HttpResult> AddUpdateGymLogo([FromQuery] int gymID, [FromQuery] UserController.Crop crop)
        {
            DateTime now = DateTime.Now;

            GymFinderGym gym = await db.GymFinderGym.FindAsync(gymID);

            if (Request.Form.Files.Count > 0 && Request.Form.Files[0].FileName != gym.ImageLocationLogo && Request.Form.Files[0].Length > 0)
            {
                var imageFile = Request.Form.Files[0];
                    

                string appPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "gymfinder", "logos");


                byte[] postedImg = Functions.ConvertToBytes(imageFile);
                if (crop.Width > 0 && crop.Height > 0)
                {
                    postedImg = Functions.CropImage(postedImg, (int)crop.X, (int)crop.Y, (int)crop.Width, (int)crop.Height);
                }
                Functions.ReduceImageQuality(ref postedImg, 50000);

                MagickImage finalImage = new MagickImage(postedImg);
                finalImage.Format = MagickFormat.Jpg;

                string fileName = "";

                using (MemoryStream ms = new MemoryStream())
                {
                    finalImage.Write(ms);

                    if (!Directory.Exists(appPath))
                    {
                        Directory.CreateDirectory(appPath);
                    }

                    fileName = string.Format("{0}_gymlogo_{1}.jpg", gym.Id, now.Ticks);
                    string filePath = Path.Combine(appPath, fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        ms.Position = 0;
                        ms.CopyTo(fileStream);
                    }
                }

                gym.ImageLocationLogo = string.Format("/dist/uploads/images/gymfinder/logos/{0}", fileName);


                db.Entry(gym).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _ = await db.SaveChangesAsync();

                //update to latest entry, otherwise logo/images may not be correct as the two upload almost simultaneously
                gym = db.GymFinderGym.Find(gym.Id);
            }
            else if(Request.Form.Files[0].FileName == "delete")
            {
                DeleteGymLogo(gym.Id);
                gym.ImageLocationLogo = string.Empty;
                db.Entry(gym).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                _ = await db.SaveChangesAsync();
            }

            return new HttpResult(true, gym, "");
        }

        [HttpPost("DeleteGymFinderGym/{gymID}")]
        public async Task<HttpResult> DeleteGymFinderGym([FromRoute] int gymID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                GymFinderGym deleting = await db.GymFinderGym.FindAsync(gymID);

                DeleteGymLogo(deleting.Id);

                DeleteAllGymImages(deleting.Id);

                //Delete db entry

                db.GymFinderGym.Remove(deleting);

                await db.SaveChangesAsync();

                return new HttpResult(true, null, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        private void DeleteSingleGymImage(int gymID, int imageNum)
        {
            //Delete gym images
            string imgsPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "gymfinder", "gyms");

            string imgFileNameStart = string.Format("{0}_gymimage_{1}", gymID, imageNum);

            DirectoryInfo imgsDirectory = new DirectoryInfo(imgsPath);

            FileInfo imgDelete = imgsDirectory.GetFiles().FirstOrDefault(x => x.Name.StartsWith(imgFileNameStart));

            if (imgDelete != null)
                imgDelete.Delete();
        }

        private void DeleteAllGymImages(int gymID)
        {
            //Delete gym images
            string imgsPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "gymfinder", "gyms");

            string imgFileNameStart = string.Format("{0}_gymimage", gymID);

            DirectoryInfo imgsDirectory = new DirectoryInfo(imgsPath);

            List<FileInfo> imgsDelete = imgsDirectory.GetFiles().Where(x => x.Name.StartsWith(imgFileNameStart)).ToList();

            foreach (var i in imgsDelete)
            {
                i.Delete();
            }
        }

        private void DeleteGymLogo(int gymID)
        {
            //Delete logo image
            string logoPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "gymfinder", "logos");

            string logoFileNameStart = string.Format("{0}_gymlogo", gymID);

            DirectoryInfo logoDirectory = new DirectoryInfo(logoPath);

            FileInfo logoDelete = logoDirectory.GetFiles().FirstOrDefault(x => x.Name.StartsWith(logoFileNameStart));

            if (logoDelete != null)
                logoDelete.Delete();
        }
    }
}
