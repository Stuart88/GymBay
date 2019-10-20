using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using ImageMagick;
using Microsoft.AspNetCore.Mvc;

namespace GymBay.Controllers
{
    [Route("api/Images")]
    public class ImagesController : Controller
    {
        readonly GymBayContext db = new GymBayContext();
       
        [HttpGet("GymShareImage")]
        public async Task<IActionResult> GymShareImage([FromQuery] int gymid)
        {

            GymFinderGym gym = await db.GymFinderGym.FindAsync(gymid);

            string logoPath = string.IsNullOrEmpty(gym.ImageLocationLogo)
                     ? Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "images", "gymfinder", "default-gym.svg")
                     : Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "gymfinder", "logos", gym.ImageLocationLogo.Split('/').Last());

            string backgroundPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "images", "blank-background.png");

            using (MagickImage logoImage = new MagickImage(logoPath))
            {
                using (MagickImage backgroundIamge = new MagickImage(backgroundPath))
                {
                    logoImage.Resize(250, 250);

                    //backgroundIamge.Resize(680, 400);

                    backgroundIamge.Composite(logoImage, 230, 75, CompositeOperator.Over);

                    return File(backgroundIamge.ToByteArray(), "image/jpg");
                }

            }



        }

        [HttpGet("CoachShareImage")]
        public async Task<IActionResult> CoachShareImage([FromQuery] int coachid)
        {

            User coach = await db.User.FindAsync(coachid);

            string logoPath = string.IsNullOrEmpty(coach.ProfilePic)
                   ? Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "images", "coachfinder", "default-coach.svg")
                   : Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "uploads", "images", "users", "profilepics", coach.ProfilePic.Split('/').Last());

            string backgroundPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "dist", "images", "blank-background.png");

            using (MagickImage logoImage = new MagickImage(logoPath))
            
                using (MagickImage backgroundIamge = new MagickImage(backgroundPath))
                {
                    logoImage.Resize(250, 250);

                    //backgroundIamge.Resize(680, 400);

                    backgroundIamge.Composite(logoImage, 230, 75, CompositeOperator.Over);

                    return File(backgroundIamge.ToByteArray(), "image/jpg");
                }

            



        }


    }
}
