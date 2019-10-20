using GymBay.Helpers;
using GymBay.Models.DbClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static GymBay.Helpers.Enums;

namespace GymBay.Models.Forum
{
    public class ForumPostPublic
    {
        public ForumPostPublic() { }
        public ForumPostPublic(ForumPost p, User u, bool getChildPosts, GymBayContext db)
        {
            Id = p.Id;
            CreationDate = p.CreationDate;
            ModifiedDate = p.ModifiedDate;
            AuthorId = p.AuthorId;
            AuthorName = u.Username;
            AuthorPic = string.IsNullOrEmpty(u.ProfilePic) ? "/dist/images/users/default-user.jpg" : u.ProfilePic;
            Category = p.Category;
            PostLevel = p.PostLevel;
            Title = p.Title;
            Upvotes = p.Upvotes;
            ParentId = p.ParentId;
            Status = p.Status;
            Content = p.Content;

            if (p.Status == (int)PostStatus.DeletedByModerator)
            {
                Content = "Deleted by moderator";
            }
            else if (p.Status == (int)PostStatus.DeletedByUser)
            {
                Content = "Deleted by user";
            }

            if (getChildPosts)
            {
                ChildPosts = (from post in db.ForumPost
                              join user in db.User
                              on post.AuthorId equals user.Id
                              where post.ParentId == Id
                              orderby p.CreationDate ascending
                              select new { post = p, user = u })
                         .AsEnumerable()
                         .Select(s => new ForumPostPublic(s.post, s.user, s.post.PostLevel != (int)ForumPostLevel.Max, db));
            }
        }
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorPic { get; set; }
        public int Category { get; set; }
        public int PostLevel { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Upvotes { get; set; }
        public int? ParentId { get; set; }
        public int Status { get; set; }

        IEnumerable<ForumPostPublic> ChildPosts { get; set; }
    }
}
