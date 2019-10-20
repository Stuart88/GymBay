using System;

namespace GymBay.Models.DbClasses
{
    public partial class ForumPost
    {
        #region Public Properties

        public int AuthorId { get; set; }
        public int BaseId { get; set; }
        public int Category { get; set; }
        public string Content { get; set; }
        public DateTime CreationDate { get; set; }
        public int Id { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int? ParentId { get; set; }
        public int PostLevel { get; set; }
        public int Status { get; set; }
        public string Title { get; set; }
        public string Upvotes { get; set; }

        #endregion Public Properties
    }
}