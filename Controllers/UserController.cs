using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using ImageMagick;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace GymBay.Controllers
{
    [Route("api/User")]
    public class UserController : Controller
    {
        readonly GymBayContext db = new GymBayContext();

        [HttpPost("FacebookLogin")]
        public async Task<HttpResult> FacebookLogin([FromHeader] string authorisation, [FromForm] FBLogin fblogin)
        {
            try
            {
                if (Functions.CheckAuthorisation(authorisation, out string email, out _))
                {

                    var hello = Request;
                    // = (FBLogin)JsonConvert.DeserializeObject(Request.Form.Keys.First()); 

                    User loggingIn;
                    bool newUser = false;

                    if (db.User.Any(x => x.Email == email))
                    {
                        loggingIn = db.User.FirstOrDefault(x => x.Email == email);
                    }
                    else if (!Functions.IsEmail(email))
                    {
                        throw new Exception("Email invalid!");
                    }
                    else
                    {
                        newUser = true;
                        BasicRegistrationDetails details = new BasicRegistrationDetails
                        {
                            FirstName = fblogin.FirstName,
                            LastName = fblogin.LastName,
                            Email = email
                        };
                        loggingIn =  await CreateNewUser(details);
                    }

                    loggingIn.SessionToken = Functions.RandomString(40);

                    db.Entry(loggingIn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    Response.Cookies.Append("UserID", loggingIn.Id.ToString());
                    Response.Cookies.Append("SessionID", loggingIn.SessionToken);

                    db.SaveChanges();

                    return new HttpResult(true, new { newUser }, "");
                }
                else
                {
                    return new HttpResult(false, null, "Unauthorised!");
                }
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("GoogleLogin")]
        public async Task<HttpResult> GoogleLogin([FromHeader] string authorisation, [FromForm]GoogleLoginData loginData)
        {
            try
            {
                if (Functions.CheckAuthorisation(authorisation, out string email, out _))
                {

                    User loggingIn;
                    bool newUser = false;

                    if (db.User.Any(x => x.Email == email))
                    {
                        loggingIn = db.User.FirstOrDefault(x => x.Email == email);
                    }
                    else if (!Functions.IsEmail(email))
                    {
                        throw new Exception("Email invalid!");
                    }
                    else
                    {
                        newUser = true;
                        var names = loginData.Name.Split(' ');
                        string firstName = names[0];
                        string secondName = names.Length == 2 ? names[1] : "";
                        BasicRegistrationDetails details = new BasicRegistrationDetails
                        {
                            FirstName = firstName,
                            LastName = secondName,
                            Email = email
                        };
                        loggingIn = await CreateNewUser(details);
                    }

                    loggingIn.SessionToken = Functions.RandomString(40);

                    db.Entry(loggingIn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    Response.Cookies.Append("UserID", loggingIn.Id.ToString());
                    Response.Cookies.Append("SessionID", loggingIn.SessionToken);

                    db.SaveChanges();

                    return new HttpResult(true, new { newUser }, "");
                }
                else
                {
                    return new HttpResult(false, null, "Unauthorised!");
                }
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpGet("GetUser/{getEmail}")]
        public HttpResult GetUser([FromRoute] bool getEmail)
        {
            try
            {
                if (Functions.UserLoggedIn(Request, out User user))
                {
                    return new HttpResult(true, new UserPublic(user, getEmail), "");
                }
                else
                    throw new Exception("Not logged in!");

            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpGet("GetCoach")]
        public HttpResult GetCoach([FromQuery]int userID)
        {
            try
            {

                var coach = db.User.Find(userID);

                if (coach == null)
                    throw new Exception("No gym found.");


                return new HttpResult(true, new UserPublic(coach, false), "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));

            }

        }

        [HttpGet("ProfilePic")]
        public IActionResult ProfilePic([FromQuery]int userID)
        {
            var user = db.User.Find(userID);

            if (user == null || string.IsNullOrEmpty(user.ProfilePic))
                return File("/dist/images/users/default-user.jpg", "image/jpg");


            return File(user.ProfilePic, "image/jpeg");

        }

        [HttpPost("UpdateUser")]
        public async Task<HttpResult> UpdateUser([FromBody] UserPublic user)
        {
            try
            {
                if (Functions.UserLoggedIn(Request, out User loggingOut))
                {

                    User updating = await db.User.FindAsync(user.Id);
                    if (updating == null)
                        throw new Exception("User not found!");

                    DateTime now = DateTime.Now;

                    if (updating.Username != user.Username){

                        if (user.Username.Length < 5)
                            throw new Exception("Username not long enough!");

                        user.Username = user.Username.Replace(" ", "");

                        if (db.User.Any(x => x.Username == user.Username))
                            throw new Exception(string.Format("Username {0} already exists!", user.Username));

                        updating.Username = user.Username;
                    }


                    if(updating.CityId != user.CityId && user.CityId > 0)
                    {
                        CityGeo city = await db.CityGeo.FindAsync(user.CityId);
                        updating.CityId = user.CityId;
                        updating.CityName = city.CityName;
                        updating.CountryId = db.CountryGeo.FirstOrDefault(x => x.CountryName == city.CountryName).Id;
                        updating.CountryName = city.CountryName;
                        updating.Latitude = city.Latitude;
                        updating.Longitutde = city.Longitude;
                        
                    }
                    if (!string.IsNullOrEmpty(user.Website) && user.Website.StartsWith("www"))
                    {
                        user.Website = "https://" + user.Website;
                    }
                    if (!string.IsNullOrEmpty(user.Youtube) && user.Youtube.StartsWith("www"))
                    {
                        user.Youtube = "https://" + user.Youtube;
                    }
                    if (!string.IsNullOrEmpty(user.Facebook) && user.Facebook.StartsWith("www"))
                    {
                        user.Facebook = "https://" + user.Facebook;
                    }
                    if (!string.IsNullOrEmpty(user.Twitter) && user.Twitter.StartsWith("www"))
                    {
                        user.Twitter = "https://" + user.Twitter;
                    }
                    if (!string.IsNullOrEmpty(user.Instagram) && user.Instagram.StartsWith("www"))
                    {
                        user.Instagram = "https://" + user.Instagram;
                    }
                    if (!string.IsNullOrEmpty(user.Linkedin) && user.Linkedin.StartsWith("www"))
                    {
                        user.Linkedin = "https://" + user.Instagram;
                    }

                    updating.ModifedDate = now;

                    updating.Bio = user.Bio;
                    updating.BodyBuilding = user.BodyBuilding;
                    updating.Boxing = user.Boxing;
                    updating.Calisthenics = user.Calisthenics;
                    updating.CoachBio = user.CoachBio;
                    updating.Crossfit = user.Crossfit;
                    updating.Endurance = user.Endurance;
                    updating.Facebook = user.Facebook;
                    updating.FirstName = user.FirstName;
                    updating.Gymnastics = user.Gymnastics;
                    updating.Instagram = user.Instagram;
                    updating.IsCoach = user.IsCoach;
                    updating.Kickboxing = user.Kickboxing;
                    updating.LastName = user.LastName;
                    updating.Mma = user.Mma;
                    updating.Phone = user.Phone;
                    updating.Powerlifting = user.Powerlifting;
                    updating.ShopId = user.ShopId;
                    updating.StrongManWoman = user.StrongManWoman;
                    updating.Twitter = user.Twitter;
                    updating.WeightLifting = user.WeightLifting;
                    updating.Youtube = user.Youtube;
                    updating.Whatsapp = user.Whatsapp;
                    updating.Linkedin = user.Linkedin;
                    updating.GooglePlus = user.GooglePlus;
                    updating.Snapchat = user.Snapchat;
                    updating.Skype = user.Skype;
                    updating.Website = user.Website;

                    updating.CoachBodybuilding = user.CoachBodybuilding;
                    updating.CoachClasses = user.CoachClasses;
                    updating.CoachCrossfit = user.CoachCrossfit;
                    updating.CoachDance = user.CoachDance;
                    updating.CoachMasseuse = user.CoachMasseuse;
                    updating.CoachNutrition = user.CoachNutrition;
                    updating.CoachOlympicLifting = user.CoachOlympicLifting;
                    updating.CoachOneOnOne = user.CoachOneOnOne;
                    updating.CoachOnlineAvailable = user.CoachOnlineAvailable;
                    updating.CoachOnlineOnly = user.CoachOnlineOnly;
                    updating.CoachPhysio = user.CoachPhysio;
                    updating.CoachPowerlifting = user.CoachPowerlifting;
                    updating.CoachProgramOnly = user.CoachProgramOnly;
                    updating.CoachStrongman = user.CoachStrongman;
                    updating.CoachWeightLoss = user.CoachWeightLoss;
                    updating.CoachOther = user.CoachOther;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    _ = await db.SaveChangesAsync();

                    return new HttpResult(true, new UserPublic(updating, true), "");
                }
                else
                    throw new Exception("Not logged in!");

            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }
        [HttpPost("AddUpdateProfilePic")]
        public async Task<HttpResult> AddUpdateProfilePic([FromQuery] int userID, [FromQuery] Crop crop)
        {
            DateTime now = DateTime.Now;

            User user = await db.User.FindAsync(userID);

            DeleteUserPic(user.Id);

            if (Request.Form.Files.Count > 0 && Request.Form.Files[0].FileName != user.ProfilePic && Request.Form.Files[0].Length > 0)
            {
                var imageFile = Request.Form.Files[0];


                string appPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "users", "profilepics");


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

                    fileName = string.Format("{0}_userpic_{1}.jpg", user.Id, now.Ticks);
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

                user.ProfilePic = string.Format("/dist/uploads/images/users/profilepics/{0}", fileName);


                db.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _ = await db.SaveChangesAsync();

               
            }
            else
            {
                user.ProfilePic= string.Empty;
                db.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                _ = await db.SaveChangesAsync();
            }

            //update to latest entry to ensure profiePic URL correct
            user = db.User.Find(user.Id);

            return new HttpResult(true, new UserPublic(user, true), "");
        }
        [HttpPost("DeleteUser/{userID}")]
        public async Task<HttpResult> DeleteUserGym([FromRoute] int userID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                User deleting = await db.User.FindAsync(userID);

                DeleteUserPic(deleting.Id);

                db.User.Remove(deleting);

                await db.SaveChangesAsync();

                return new HttpResult(true, null, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }
        private void DeleteUserPic(int userID)
        {
            //Delete logo image
            string imgPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "users", "profilepics");

            string imgFileNameStart = string.Format("{0}_userpic", userID);

            DirectoryInfo imgDirectory = new DirectoryInfo(imgPath);

            FileInfo logoDelete = imgDirectory.GetFiles().FirstOrDefault(x => x.Name.StartsWith(imgFileNameStart));

            if (logoDelete != null)
                logoDelete.Delete();
        }

        [HttpPost("Upvote")]
        public async Task<HttpResult> Upvote([FromQuery] int itemType, [FromQuery] int itemID )
        {
            try
            {
                if (Functions.UserLoggedIn(Request, out User user))
                {
                    string voteString = "";

                    switch (itemType)
                    {
                        case (int)Enums.UpvoteItems.GymReview:
                            voteString = await ChangeGymReviewVotes(itemID, user.Id);
                            break;
                        case (int)Enums.UpvoteItems.CoachReview:
                            voteString = await ChangeCoachReviewVotes(itemID, user.Id);
                            break;
                        case (int)Enums.UpvoteItems.NewsFeedComment:
                            voteString = await ChangeNewsFeedCommentVotes(itemID, user.Id);
                            break;
                        case (int)Enums.UpvoteItems.NewsFeedPost:
                            voteString = await ChangeNewsFeedPostVotes(itemID, user.Id);
                            break;

                    }

                    return new HttpResult(true, voteString, "");
                }
                else
                    throw new Exception("Not logged in!");

            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        private async Task<string> ChangeGymReviewVotes(int itemID, int userID)
        {
            var gymReview = await db.GymReview.FindAsync(itemID);

            if (gymReview == null)
                throw new Exception("Nothing found!");
            else
            {
                gymReview.Upvotes = ChangeUpvotes(gymReview.Upvotes, userID);

                db.Entry(gymReview).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _ = await db.SaveChangesAsync();

                return gymReview.Upvotes;
            }
        }
        private async Task<string> ChangeCoachReviewVotes(int itemID, int userID)
        {
            var coachReview = await db.CoachReview.FindAsync(itemID);

            if (coachReview == null)
                throw new Exception("Nothing found!");
            else
            {
                coachReview.Upvotes = ChangeUpvotes(coachReview.Upvotes, userID);

                db.Entry(coachReview).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _ = await db.SaveChangesAsync();

                return coachReview.Upvotes;
            }
        }
        private async Task<string> ChangeNewsFeedPostVotes(int itemID, int userID)
        {
            var newsFeedPost = await db.NewsFeedPost.FindAsync(itemID);

            if (newsFeedPost == null)
                throw new Exception("Nothing found!");
            else
            {
                newsFeedPost.Upvotes = ChangeUpvotes(newsFeedPost.Upvotes, userID);

                db.Entry(newsFeedPost).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _ = await db.SaveChangesAsync();

                return newsFeedPost.Upvotes;
            }
        }
        private async Task<string> ChangeNewsFeedCommentVotes(int itemID, int userID)
        {
            var comment = await db.NewsFeedComment.FindAsync(itemID);

            if (comment == null)
                throw new Exception("Nothing found!");
            else
            {
                comment.Upvotes = ChangeUpvotes(comment.Upvotes, userID);

                db.Entry(comment).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _ = await db.SaveChangesAsync();

                return comment.Upvotes;
            }
        }

        private string ChangeUpvotes(string votes, int userID)
        {
            if (string.IsNullOrEmpty(votes))
                return string.Format("{0},", userID);
            else
            {
                List<int> voteIDs = votes.Split(",").Where(v => !string.IsNullOrEmpty(v)).Select(s => int.Parse(s)).ToList();

                if (voteIDs.Contains(userID))
                    voteIDs.Remove(userID);
                else
                    voteIDs.Add(userID);

                return string.Join(",", voteIDs.Select(s => s.ToString()));
            }
            
        }

        [HttpPost("UserLogout")]
        public HttpResult UserLogout()
        {
            try
            {
                if (Functions.UserLoggedIn(Request, out User loggingOut))
                {
                    if (Request.Cookies["UserID"] != null)
                    {
                        Response.Cookies.Delete("UserID");
                    }

                    if (Request.Cookies["SessionID"] != null)
                    {
                        Response.Cookies.Delete("SessionID");
                    }

                    loggingOut.SessionToken = string.Empty;
                    db.Entry(loggingOut).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    db.SaveChanges();

                    return new HttpResult(true, null, "");
                }
                else
                {//user already logged out
                    return new HttpResult(true, null, "");
                }

            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }
        public static async Task<User> CreateNewUser(BasicRegistrationDetails details)
        {
            using(GymBayContext db = new GymBayContext())
            {
                DateTime now = DateTime.Now;
                User newUser = new User
                {
                    CreationDate = now,
                    ModifedDate = now,
                    Email = details.Email,
                    FirstName = details.FirstName,
                    LastName = details.LastName,
                    Username = string.Format("{0}{1}", details.FirstName, details.LastName),
                    Status = (int)Enums.UserStatus.Active,
                    Bio = "",
                    AverageRating = 5d,
                    CoachBio = "",
                };

                newUser.Username = EnsureUsernameAuthentic(newUser.Username);

                db.User.Add(newUser);

                await db.SaveChangesAsync();

                return newUser;
            }
           
        }

       

        private static string EnsureUsernameAuthentic(string username)
        {
            using (GymBayContext db = new GymBayContext())
            {
                username = username.Replace(" ", "");

                if (username.Length < 5)
                    username = username.PadRight(5, '8');


                int count = 1;
                string currentName = username;
                while (db.User.Any(x => x.Username == username && username.Length < 5))
                {
                    username = string.Format("{0}{1}", currentName, count);
                    count++;
                }
                return username;
            }
           
        }

       
        public class BasicRegistrationDetails
        {
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }
        public class FBLogin
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string PicURL { get; set; }
        }
        public class GoogleLoginData
        {
            public string Name { get; set; }
            public string PicURL { get; set; }
        }

        public class Crop
        {
            public double X { get; set; }
            public double Y { get; set; }
            public double Width { get; set; }
            public double Height { get; set; }
            public double Aspect { get; set; }
        }
    }
}
