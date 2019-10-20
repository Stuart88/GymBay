using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Helpers
{
    public static class Enums
    {
       public  enum GymStatus
        {
            Pending,
            Live,
            Any,
        }
        public enum FeaturedState
        {
            NotFeatured,
            Featured,
        }
        public enum UserStatus
        {
            Inactive,
            Active
        }
        public enum ItemStatus
        {
            Inactive,
            Live
        }
        public enum PostStatus
        {
            Live,
            DeletedByUser,
            DeletedByModerator,
        }
        public enum UpvoteItems
        {
            GymReview,
            CoachReview,
            NewsFeedPost,
            NewsFeedComment
        }
        public enum VerifiedSatus
        {
            NotVerified,
            Verfifed
        }

        public enum ForumCategory
        {
            General
        }
        public enum ForumPostLevel
        {
            Base,
            Second,
            Third,
            Max
        }
    }
}
