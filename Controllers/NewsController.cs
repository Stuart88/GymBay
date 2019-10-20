using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using GymBay.Models.NewsFeed;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static GymBay.Helpers.Enums;

namespace GymBay.Controllers
{
    [Route("api/News")]
    public class NewsController : Controller
    {
        #region Private Fields

        private readonly GymBayContext db = new GymBayContext();

        #endregion Private Fields

        #region Public Methods

        [HttpPost("AddEditComment")]
        public async Task<HttpResult> AddEditComment([FromBody] NewsFeedComment comment)
        {
            try
            {
                if (!Functions.UserLoggedIn(Request, out User user))
                    throw new Exception("Not logged in!");

                if (comment.AuthorId != user.Id)
                    throw new Exception("Denied!");

                if (comment.Comment.Length > 1024)
                    throw new Exception("Comment too long!");

                if (CheckSpam(user.Id, comment.PostId))
                    throw new Exception("Spam Blocker: No more than 3 posts in a row!");

                DateTime now = DateTime.Now;

                if (comment.Id > 1)
                {
                    NewsFeedComment updating = db.NewsFeedComment.Find(comment.Id);
                    Functions.CheckNull(updating);

                    updating.Comment = comment.Comment;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();
                }
                else
                {
                    comment.CreationDate = now;
                    comment.AuthorId = user.Id;
                    comment.Status = (int)PostStatus.Live;

                    db.NewsFeedComment.Add(comment);

                    await db.SaveChangesAsync();
                }

                return new HttpResult(true, new NewsFeedCommentPublic(comment, user), "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("DeleteNewsfeedPost/{postID}")]
        public async Task<HttpResult> DeleteNewsfeedPost([FromRoute] int postID)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                NewsFeedPost deleting = await db.NewsFeedPost.FindAsync(postID);

                if (deleting == null)
                    throw new Exception("Post not found!");

                db.NewsFeedPost.Remove(deleting);

                await db.SaveChangesAsync();

                return new HttpResult(true, null, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpPost("EditNewsfeedPost")]
        public async Task<HttpResult> EditNewsfeedPost([FromBody] NewsFeedPost post)
        {
            try
            {
                if (!Functions.AdminLoggedIn(Request, out _))
                    throw new Exception("Not logged in!");

                DateTime now = DateTime.Now;

                if (post.Id > 1)
                {
                    NewsFeedPost updating = db.NewsFeedPost.Find(post.Id);
                    Functions.CheckNull(updating);

                    updating.ModifiedDate = now;
                    updating.Title = post.Title;
                    updating.ImageUrl = post.ImageUrl;
                    updating.VideoUrl = post.VideoUrl;
                    updating.Content = post.Content;
                    updating.PostDate = post.PostDate;
                    updating.Status = post.Status;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();
                }
                else
                {
                    post.CreationDate = now;
                    post.ModifiedDate = now;
                    post.Status = (int)Enums.ItemStatus.Live;

                    db.NewsFeedPost.Add(post);

                    await db.SaveChangesAsync();
                }

                return new HttpResult(true, post, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpGet("NewsFeed")]
        public HttpResult NewsFeed([FromQuery]int page)
        {
            try
            {
                bool adminLoggedIn = Functions.AdminLoggedIn(Request, out _);

                var newsItems = (from p in db.NewsFeedPost
                                 where p.Status == (int)Enums.ItemStatus.Live
                                 && p.PostDate <= DateTime.Now || adminLoggedIn //get all for admin
                                 orderby p.PostDate descending
                                 select p);

                int total = newsItems.Count();

                var selectedItems = newsItems.Skip(page * 5)
                    .Take(5)
                    .Select(s => new NewsFeedPostSingle
                    {
                        NewsFeedPost = s,
                        Comments = new List<NewsFeedCommentPublic>(),//not needed here
                        CommentsCount = (from c in db.NewsFeedComment where c.PostId == s.Id select c).Count()
                    })
                    .ToList();

                foreach (var i in selectedItems)
                {
                    i.NewsFeedPost.Content = new string(Functions.StripHTML(i.NewsFeedPost.Content).Take(400).ToArray()) + "...";
                }

                return new HttpResult(true, new { posts = selectedItems, total }, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpGet("NewsFeedPost")]
        public HttpResult NewsFeedPost([FromQuery]int postID)
        {
            try
            {
                bool adminLoggedIn = Functions.AdminLoggedIn(Request, out _);

                NewsFeedPost post = db.NewsFeedPost.Find(postID);

                if (post == null)
                    throw new Exception("Post not found!");

                if (post.Status != (int)ItemStatus.Live && !adminLoggedIn)
                    throw new Exception("Denied!");

                List<NewsFeedCommentPublic> comments = (from c in db.NewsFeedComment
                                                        join u in db.User on c.AuthorId equals u.Id
                                                        where c.PostId == post.Id
                                                        orderby c.CreationDate descending
                                                        select new { comment = c, author = u })
                                                  .AsEnumerable()
                                                  .Select(s => new NewsFeedCommentPublic(s.comment, s.author))
                                                  .ToList();

                return new HttpResult(true, new NewsFeedPostSingle { NewsFeedPost = post, Comments = comments }, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        /// <summary>
        /// Delete/Undelete comments
        /// </summary>
        /// <param name="comment"></param>
        /// <returns></returns>
        [HttpPost("ToggleDeleteComment")]
        public async Task<HttpResult> ToggleDeleteComment([FromBody] NewsFeedCommentPublic comment)
        {
            try
            {
                bool isAdmin = Functions.AdminLoggedIn(Request, out _);

                //reject if no user logged in
                if (!Functions.UserLoggedIn(Request, out User author) && !isAdmin)
                    throw new Exception("Not logged in!");

                //reject if user is not admin and post does not belong to user
                if (!isAdmin && author != null && comment.AuthorId != author.Id)
                    throw new Exception("Denied!");

                NewsFeedComment updating = db.NewsFeedComment.Find(comment.Id);
                if (updating == null)
                    throw new Exception("Nothing found!");

                if (isAdmin)
                {
                    updating.Status = updating.Status == (int)PostStatus.DeletedByModerator ? (int)PostStatus.Live : (int)PostStatus.DeletedByModerator;
                }
                else
                {
                    updating.Status = updating.Status == (int)PostStatus.DeletedByUser ? (int)PostStatus.Live : (int)PostStatus.DeletedByUser;
                }

                db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                await db.SaveChangesAsync();

                //if admin, need to get comment author for creating NewsFeedCommentPublic
                if (isAdmin)
                    author = db.User.Find(updating.AuthorId);

                return new HttpResult(true, new NewsFeedCommentPublic(updating, author), "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        #endregion Public Methods

        #region Private Methods

        private bool CheckSpam(int userID, int postID)
        {
            DateTime now = DateTime.Now;

            IQueryable<NewsFeedComment> latestComments = (from c in db.NewsFeedComment
                                                          where c.PostId == postID
                                                          && c.CreationDate.Year == now.Year
                                                          && c.CreationDate.DayOfYear == now.DayOfYear
                                                          orderby c.CreationDate descending
                                                          select c)
                                                          .Take(3);

            return latestComments.Count() == 3 && latestComments.All(c => c.AuthorId == userID);
        }

        #endregion Private Methods
    }
}