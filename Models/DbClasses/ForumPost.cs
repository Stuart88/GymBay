using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class ForumPost
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int AuthorId { get; set; }
        public int Category { get; set; }
        public int PostLevel { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Upvotes { get; set; }
        public int? ParentId { get; set; }
        public int Status { get; set; }
        public int BaseId { get; set; }
    }
}
