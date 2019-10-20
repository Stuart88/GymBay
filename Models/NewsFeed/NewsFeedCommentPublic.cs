using GymBay.Models.DbClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static GymBay.Helpers.Enums;

namespace GymBay.Models.NewsFeed
{
    public class NewsFeedCommentPublic
    {
        public NewsFeedCommentPublic() { }
        public NewsFeedCommentPublic(NewsFeedComment c, User u)
        {
            CreationDate = c.CreationDate;
            Id = c.Id;
            AuthorId = c.AuthorId;
            Comment = c.Comment;
            PostId = c.PostId;
            Status = c.Status;
            AuthorName = u.Username;
            AuthorPic = string.IsNullOrEmpty(u.ProfilePic) ? "/dist/images/users/default-user.jpg" : u.ProfilePic;
            Upvotes = c.Upvotes ?? "";

            if (c.Status == (int)PostStatus.DeletedByModerator)
            {
                Comment = "Deleted by moderator";
            }
            else if (c.Status == (int)PostStatus.DeletedByUser)
            {
                Comment = "Deleted by user";
            }

        }
        public DateTime CreationDate { get; set; }
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorPic { get; set; }
        public string Comment { get; set; }
        public int Status { get; set; }
        public int PostId { get; set; }
        public string Upvotes { get; set; }
    }
}
