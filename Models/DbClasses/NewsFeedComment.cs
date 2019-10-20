using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class NewsFeedComment
    {
        public DateTime CreationDate { get; set; }
        public int Id { get; set; }
        public int AuthorId { get; set; }
        public string Comment { get; set; }
        public int Status { get; set; }
        public int PostId { get; set; }
        public string Upvotes { get; set; }
    }
}
