using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.Forum
{
    public class FullThread
    {
        public List<ForumPostPublic> Posts { get; set; }
        public int Replies { get; set; }
        public int Upvotes { get; set; }
    }
}
