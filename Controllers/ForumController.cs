using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.Forum;
using GymBay.Models.General;
using ImageMagick;
using Microsoft.AspNetCore.Mvc;

namespace GymBay.Controllers
{
    [Route("api/Forum")]
    public class ForumController : Controller
    {
        readonly GymBayContext db = new GymBayContext();

        [HttpPost("AddEditPost")]
        public async Task<HttpResult> AddEditPost([FromBody] ForumPostPublic post)
        {
            try
            {
                if (!Functions.UserLoggedIn(Request, out User user))
                    throw new Exception("Not logged in!");

              

                DateTime now = DateTime.Now;

                if (post.Id > 0)
                {
                    ForumPost updating = db.ForumPost.Find(post.Id);
                    Functions.CheckNull(updating);

                    updating.ModifiedDate = now;
                    updating.Title = post.Title;
                    updating.Content = post.Content;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();
                }
                else
                {
                    ForumPost adding = new ForumPost
                    {
                        CreationDate = now,
                        ModifiedDate = now,
                        AuthorId = user.Id,
                        PostLevel = (int)Enums.ForumPostLevel.Base,
                        Upvotes = "",
                        Title = post.Title,
                        Content = post.Content,
                        BaseId = 0,
                        Category = post.Category,
                        Status = (int)Enums.PostStatus.Live
                    };
                  

                    db.ForumPost.Add(adding);

                    await db.SaveChangesAsync();

                }

                return new HttpResult(true, post, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        [HttpGet("GetThreads")]
        public HttpResult GetThreads([FromQuery]int page, [FromQuery]int? category)
        {
            try
            {
                int amountPerPage = 50;

                var query = (from p in db.ForumPost
                             join u in db.User
                             on p.AuthorId equals u.Id
                             where p.Category == category || category == null
                             && p.PostLevel == (int)Enums.ForumPostLevel.Base
                             orderby p.CreationDate descending
                             select new { post = p, user = u });

                int total = query.Count();

                int pages = total / amountPerPage;

                var threads = query.Skip(page * amountPerPage)
                         .Take(50)
                         .AsEnumerable()
                         .Select(s => new ForumPostPublic(s.post, s.user, false, null));

                return new HttpResult(true, new { threads, total, pages}, "");
            }
            catch(Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }

        [HttpGet("GetThread")]
        public HttpResult GetPosts([FromQuery]int baseID, [FromQuery]int page)
        {
            try
            {
                FullThread thread = new FullThread();

                thread.Posts = (from p in db.ForumPost
                                join u in db.User
                                on p.AuthorId equals u.Id
                                where p.Id == baseID && p.PostLevel == (int)Enums.ForumPostLevel.Base
                                orderby p.CreationDate ascending
                                select new { post = p, user = u })
                         .Skip(page * 25)
                         .Take(25)
                         .AsEnumerable()
                         .Select(s => new ForumPostPublic(s.post, s.user, s.post.PostLevel != (int)Enums.ForumPostLevel.Max, db))
                         .ToList();

                thread.Replies = (from p in db.ForumPost
                                  where p.Id == baseID || p.BaseId == baseID
                                  select p).Count();

                thread.Upvotes = (from p in db.ForumPost
                                  where p.Id == baseID || p.BaseId == baseID
                                  select p.Upvotes)
                                  .AsEnumerable()
                                  .Select(s => s.Split(",").Where(x => !string.IsNullOrEmpty(x)).ToArray())
                                  .Sum(s => s.Count());



                return new HttpResult(true, thread, "");
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
        }


    }
}
