namespace GymBay.Models.DbClasses
{
    public partial class Category
    {
        #region Public Properties

        public int CategoryLevel { get; set; }
        public string CategoryPath { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }

        #endregion Public Properties
    }
}