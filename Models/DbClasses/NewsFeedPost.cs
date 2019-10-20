using System;

namespace GymBay.Models.DbClasses
{
    public partial class NewsFeedPost
    {
        #region Public Properties

        public string Content { get; set; }
        public DateTime CreationDate { get; set; }
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime PostDate { get; set; }
        public int Status { get; set; }
        public string Title { get; set; }
        public string Upvotes { get; set; }
        public string VideoUrl { get; set; }

        #endregion Public Properties
    }
}