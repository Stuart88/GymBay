using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using GymBay.Models.Reviews;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Controllers
{
    [Route("api/Reviews")]
    public class ReviewsController : Controller
    {
        #region Private Fields

        private readonly GymBayContext db = new GymBayContext();

        #endregion Private Fields

        #region Public Methods

        [HttpPost("AddEditCoachReview")]
        public async Task<HttpResult> AddEditCoachReview([FromBody] CoachReview review)
        {
            try
            {
                if (!Functions.UserLoggedIn(Request, out User user) && !Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                DateTime now = DateTime.Now;

                if (review.Id > 0)
                {
                    CoachReview updating = db.CoachReview.Find(review.Id);
                    Functions.CheckNull(updating);

                    updating.ModifiedDate = now;
                    updating.Title = review.Title;
                    updating.MainReview = review.MainReview;
                    updating.CoachId = review.CoachId;
                    updating.GoodPoints = review.GoodPoints;
                    updating.BadPoints = review.BadPoints;
                    updating.Rating = review.Rating;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();
                }
                else
                {
                    review.CreationDate = now;
                    review.ModifiedDate = now;
                    review.ReviewerId = user.Id;

                    db.CoachReview.Add(review);

                    await db.SaveChangesAsync();
                }

                //updating gym rating.
                User coach = await db.User.FindAsync(review.CoachId);
                coach.AverageRating = db.CoachReview.Where(x => x.CoachId == coach.Id).Average(c => c.Rating);

                db.Entry(coach).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                await db.SaveChangesAsync();

                return new HttpResult(true, review, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("AddEditGymReview")]
        public async Task<HttpResult> AddEditGymReview([FromBody] GymReview review)
        {
            try
            {
                if (!Functions.UserLoggedIn(Request, out User user) && !Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                GymFinderGym gym = await db.GymFinderGym.FindAsync(review.GymId);
                if (gym == null)
                    throw new Exception("Gym not found!");

                DateTime now = DateTime.Now;

                if (review.Id > 0)
                {
                    GymReview updating = db.GymReview.Find(review.Id);
                    Functions.CheckNull(updating);

                    updating.ModifiedDate = now;
                    updating.Title = review.Title;
                    updating.MainReview = review.MainReview;
                    updating.GymId = review.GymId;
                    updating.GoodPoints = review.GoodPoints;
                    updating.BadPoints = review.BadPoints;
                    updating.Rating = review.Rating;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();
                }
                else
                {
                    review.CreationDate = now;
                    review.ModifiedDate = now;
                    review.ReviewerId = user.Id;

                    db.GymReview.Add(review);

                    await db.SaveChangesAsync();
                }

                //updating gym rating.
                gym.AverageRating = db.GymReview.Where(x => x.GymId == gym.Id).Average(g => g.Rating);

                db.Entry(gym).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                await db.SaveChangesAsync();

                return new HttpResult(true, review, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("DeleteCoachReview/{postID}")]
        public async Task<HttpResult> DeleteCoachReview([FromRoute] int postID)
        {
            try
            {
                //    if (!Functions.AdminLoggedIn(Request, out _))
                //        throw new Exception("Not logged in!");

                CoachReview deleting = await db.CoachReview.FindAsync(postID);

                if (deleting == null)
                    throw new Exception("Post not found!");

                bool adminLoggedIn = Functions.AdminLoggedIn(Request, out _);
                bool userLoggedIn = Functions.UserLoggedIn(Request, out User editor);

                if ((!adminLoggedIn && !userLoggedIn) //no user logged in
                       || (userLoggedIn && editor.Id != deleting.ReviewerId)) //or user logged in but does not own the review
                {
                    throw new Exception("Not logged in!");
                }

                //update coach rating
                User coach = await db.User.FindAsync(deleting.CoachId);
                IQueryable<CoachReview> remainingReviews = db.CoachReview.Where(x => x.CoachId == coach.Id && x.Id != deleting.Id);
                if (remainingReviews.Count() > 0)
                {
                    coach.AverageRating = remainingReviews.Average(c => c.Rating);
                }
                else
                {
                    coach.AverageRating = 0d;
                }
                db.Entry(coach).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                db.CoachReview.Remove(deleting);

                await db.SaveChangesAsync();

                return new HttpResult(true, null, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("DeleteGymReview/{postID}")]
        public async Task<HttpResult> DeleteGymReview([FromRoute] int postID)
        {
            try
            {
                //if (!Functions.AdminLoggedIn(Request, out _))
                //    throw new Exception("Not logged in!");

                GymReview deleting = await db.GymReview.FindAsync(postID);

                if (deleting == null)
                    throw new Exception("Post not found!");

                bool adminLoggedIn = Functions.AdminLoggedIn(Request, out _);
                bool userLoggedIn = Functions.UserLoggedIn(Request, out User editor);

                if ((!adminLoggedIn && !userLoggedIn) //no user logged in
                       || (userLoggedIn && editor.Id != deleting.ReviewerId)) //or user logged in but does not own the review
                {
                    throw new Exception("Not logged in!");
                }

                //update coach rating
                GymFinderGym gym = await db.GymFinderGym.FindAsync(deleting.GymId);
                IQueryable<GymReview> remainingReviews = db.GymReview.Where(x => x.GymId == gym.Id && x.Id != deleting.Id);
                if (remainingReviews.Count() > 0)
                {
                    gym.AverageRating = remainingReviews.Average(c => c.Rating);
                }
                else
                {
                    gym.AverageRating = 0d;
                }
                db.Entry(gym).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                db.GymReview.Remove(deleting);

                await db.SaveChangesAsync();

                return new HttpResult(true, null, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpGet("GetCoachReview")]
        public HttpResult GetCoachReview([FromQuery] int id)
        {
            CoachReview r = db.CoachReview.Find(id);

            return r == null
                ? new HttpResult(false, new CoachReview(), "No Review")
                : new HttpResult(true, r, "");
        }

        [HttpGet("GetCoachReviews")]
        public HttpResult GetCoachReviews([FromQuery] int coachID)
        {
            IQueryable<CoachReviewPublic> reviews = db.CoachReview.Where(x => x.CoachId == coachID)
                .Select(r => new CoachReviewPublic
                {
                    Review = r,
                    ReviewerName = (from u in db.User where u.Id == r.ReviewerId select u.Username).FirstOrDefault(),
                    ReviewerPic = (from u in db.User where u.Id == r.ReviewerId select u.ProfilePic).FirstOrDefault()
                })
                .OrderByDescending(x => x.Review.ModifiedDate);

            return new HttpResult(true, reviews.AsEnumerable().ToList(), "");
        }

        [HttpGet("GetGymReview")]
        public HttpResult GetGymReview([FromQuery] int id)
        {
            GymReview r = db.GymReview.Find(id);

            return r == null
                ? new HttpResult(false, new GymReview(), "No Review")
                : new HttpResult(true, r, "");
        }

        [HttpGet("GetGymReviews")]
        public HttpResult GetGymReviews([FromQuery] int gymID)
        {
            IQueryable<GymReviewPublic> reviews = db.GymReview.Where(x => x.GymId == gymID)
                .Select(r => new GymReviewPublic
                {
                    Review = r,
                    ReviewerName = (from u in db.User where u.Id == r.ReviewerId select u.Username).FirstOrDefault(),
                    ReviewerPic = (from u in db.User where u.Id == r.ReviewerId select u.ProfilePic).FirstOrDefault()
                })
                .OrderByDescending(x => x.Review.ModifiedDate);

            return new HttpResult(true, reviews.AsEnumerable().ToList(), "");
        }

        [HttpGet("GetMyCoachReview")]
        public HttpResult GetMyCoachReview([FromQuery] int coachID)
        {
            if (!Functions.UserLoggedIn(Request, out User user) && !Functions.AdminLoggedIn(Request, out _))
                return new HttpResult(false, null, "");

            CoachReview r = db.CoachReview.FirstOrDefault(x => x.CoachId == coachID && x.ReviewerId == user.Id);

            return r == null
                ? new HttpResult(false, new GymReview(), "No Review")
                : new HttpResult(true, r, "");
        }

        [HttpGet("GetMyCoachReviews")]
        public HttpResult GetMyCoachReviews()
        {
            if (!Functions.UserLoggedIn(Request, out User user))
                return new HttpResult(false, null, "");

            List<CoachReview> reviews = db.CoachReview.Where(x => x.ReviewerId == user.Id).ToList();

            return new HttpResult(true, reviews, "");
        }

        [HttpGet("GetMyGymReview")]
        public HttpResult GetMyGymReview([FromQuery] int gymID)
        {
            if (!Functions.UserLoggedIn(Request, out User user) && !Functions.AdminLoggedIn(Request, out _))
                return new HttpResult(false, null, "");

            GymReview r = db.GymReview.FirstOrDefault(x => x.GymId == gymID && x.ReviewerId == user.Id);

            return r == null
                ? new HttpResult(false, new GymReview(), "No Review")
                : new HttpResult(true, r, "");
        }

        [HttpGet("GetMyGymReviews")]
        public HttpResult GetMyGymReviews()
        {
            if (!Functions.UserLoggedIn(Request, out User user))
                return new HttpResult(false, null, "");

            List<GymReview> reviews = db.GymReview.Where(x => x.ReviewerId == user.Id).ToList();

            return new HttpResult(true, reviews, "");
        }

        #endregion Public Methods
    }
}