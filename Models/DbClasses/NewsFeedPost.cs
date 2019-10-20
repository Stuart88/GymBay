using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class NewsFeedPost
    {
        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int Id { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string VideoUrl { get; set; }
        public string Content { get; set; }
        public DateTime PostDate { get; set; }
        public int Status { get; set; }
        public string Upvotes { get; set; }
    }
}
