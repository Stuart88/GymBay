using System.Collections.Generic;

namespace GymBay.Models.Forum
{
    public class FullThread
    {
        #region Public Properties

        public List<ForumPostPublic> Posts { get; set; }
        public int Replies { get; set; }
        public int Upvotes { get; set; }

        #endregion Public Properties
    }
}