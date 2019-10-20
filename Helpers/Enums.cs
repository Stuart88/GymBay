namespace GymBay.Helpers
{
    public static class Enums
    {
        #region Public Enums

        public enum FeaturedState
        {
            NotFeatured,
            Featured,
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

        public enum GymStatus
        {
            Pending,
            Live,
            Any,
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

        public enum UserStatus
        {
            Inactive,
            Active
        }

        public enum VerifiedSatus
        {
            NotVerified,
            Verfifed
        }

        #endregion Public Enums
    }
}