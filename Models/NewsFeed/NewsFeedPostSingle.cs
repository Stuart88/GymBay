using GymBay.Models.DbClasses;
using System.Collections.Generic;

namespace GymBay.Models.NewsFeed
{
    public class NewsFeedPostSingle
    {
        #region Public Properties

        public List<NewsFeedCommentPublic> Comments { get; set; }
        public int CommentsCount { get; set; }
        public NewsFeedPost NewsFeedPost { get; set; }
        public string Upvotes { get; set; }

        #endregion Public Properties
    }
}