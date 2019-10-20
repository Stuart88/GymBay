using GymBay.Models.DbClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.NewsFeed
{
    public class NewsFeedPostSingle
    {
        public NewsFeedPost NewsFeedPost { get; set; }
        public List<NewsFeedCommentPublic> Comments { get; set; }
        public int CommentsCount { get; set; }
        public string Upvotes { get; set; }
    }
}
