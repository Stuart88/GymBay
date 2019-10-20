using System;

namespace GymBay.Models.DbClasses
{
    public partial class NewsFeedComment
    {
        #region Public Properties

        public int AuthorId { get; set; }
        public string Comment { get; set; }
        public DateTime CreationDate { get; set; }
        public int Id { get; set; }
        public int PostId { get; set; }
        public int Status { get; set; }
        public string Upvotes { get; set; }

        #endregion Public Properties
    }
}