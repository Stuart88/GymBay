using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace GymBay.Models.DbClasses
{
    public partial class GymBayContext : DbContext
    {
        public GymBayContext()
        {
        }

        public GymBayContext(DbContextOptions<GymBayContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admin { get; set; }
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<CityGeo> CityGeo { get; set; }
        public virtual DbSet<CityGeoBasic> CityGeoBasic { get; set; }
        public virtual DbSet<CoachReview> CoachReview { get; set; }
        public virtual DbSet<CountryGeo> CountryGeo { get; set; }
        public virtual DbSet<ForumPost> ForumPost { get; set; }
        public virtual DbSet<GymFinderGym> GymFinderGym { get; set; }
        public virtual DbSet<GymReview> GymReview { get; set; }
        public virtual DbSet<ItemAccessory> ItemAccessory { get; set; }
        public virtual DbSet<ItemBars> ItemBars { get; set; }
        public virtual DbSet<ItemBeltSleeve> ItemBeltSleeve { get; set; }
        public virtual DbSet<ItemClothing> ItemClothing { get; set; }
        public virtual DbSet<ItemCoachClass> ItemCoachClass { get; set; }
        public virtual DbSet<ItemFootwear> ItemFootwear { get; set; }
        public virtual DbSet<ItemGeneral> ItemGeneral { get; set; }
        public virtual DbSet<ItemGym> ItemGym { get; set; }
        public virtual DbSet<ItemResistanceMachine> ItemResistanceMachine { get; set; }
        public virtual DbSet<ItemShaker> ItemShaker { get; set; }
        public virtual DbSet<ItemSupplement> ItemSupplement { get; set; }
        public virtual DbSet<ItemWeights> ItemWeights { get; set; }
        public virtual DbSet<NewsFeedComment> NewsFeedComment { get; set; }
        public virtual DbSet<NewsFeedPost> NewsFeedPost { get; set; }
        public virtual DbSet<Seller> Seller { get; set; }
        public virtual DbSet<ShoeSize> ShoeSize { get; set; }
        public virtual DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                //local
                //_ = optionsBuilder.UseSqlServer("Data Source=STUART\\SQLEXPRESS2017;Initial Catalog=GymBay;Integrated Security=True", x => x.UseNetTopologySuite());

                //server
                _ = optionsBuilder.UseSqlServer("Data Source=localhost\\SQLEXPRESS2017;Initial Catalog=GymBay;Integrated Security=True", x => x.UseNetTopologySuite());
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryPath)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.ParentId).HasColumnName("ParentID");
            });

            modelBuilder.Entity<CityGeo>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CityName).HasMaxLength(255);

                entity.Property(e => e.ContinentCode).HasMaxLength(50);

                entity.Property(e => e.ContinentName).HasMaxLength(50);

                entity.Property(e => e.CountryGeonameId).HasColumnName("CountryGeonameID");

                entity.Property(e => e.CountryName).HasMaxLength(255);

                entity.Property(e => e.GeonameId).HasColumnName("GeonameID");

                entity.Property(e => e.IsoCode).HasMaxLength(50);

                entity.Property(e => e.LocaleCode).HasMaxLength(50);

                entity.Property(e => e.TimeZone).HasMaxLength(50);
            });

            modelBuilder.Entity<CityGeoBasic>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CityGeoId).HasColumnName("CityGeoID");

                entity.Property(e => e.CityName).HasMaxLength(255);

                entity.Property(e => e.CountryName).HasMaxLength(255);

                entity.Property(e => e.NearestCity).HasMaxLength(255);
            });

            modelBuilder.Entity<CoachReview>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CoachId).HasColumnName("CoachID");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ReviewerId).HasColumnName("ReviewerID");

                entity.Property(e => e.Title).HasMaxLength(255);
            });

            modelBuilder.Entity<CountryGeo>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ContinentCode).HasMaxLength(50);

                entity.Property(e => e.ContinentName).HasMaxLength(50);

                entity.Property(e => e.CountryGeonameId).HasColumnName("CountryGeonameID");

                entity.Property(e => e.CountryName).HasMaxLength(255);

                entity.Property(e => e.Currency).HasMaxLength(10);

                entity.Property(e => e.Iso3Code).HasMaxLength(3);

                entity.Property(e => e.IsoCode).HasMaxLength(50);

                entity.Property(e => e.LocaleCode).HasMaxLength(50);

                entity.Property(e => e.TimeZone).HasMaxLength(50);
            });

            modelBuilder.Entity<ForumPost>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AuthorId).HasColumnName("AuthorID");

                entity.Property(e => e.BaseId).HasColumnName("BaseID");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ParentId).HasColumnName("ParentID");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Upvotes).IsRequired();
            });

            modelBuilder.Entity<GymFinderGym>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Facebook).HasMaxLength(255);

                entity.Property(e => e.GooglePlus).HasMaxLength(255);

                entity.Property(e => e.ImageLocation1).HasMaxLength(255);

                entity.Property(e => e.ImageLocation2).HasMaxLength(255);

                entity.Property(e => e.ImageLocation3).HasMaxLength(255);

                entity.Property(e => e.ImageLocationLogo).HasMaxLength(255);

                entity.Property(e => e.Instagram).HasMaxLength(255);

                entity.Property(e => e.Linkedin).HasMaxLength(255);

                entity.Property(e => e.LocationCityId).HasColumnName("LocationCityID");

                entity.Property(e => e.LocationCityName).HasMaxLength(255);

                entity.Property(e => e.LocationCountryId).HasColumnName("LocationCountryID");

                entity.Property(e => e.LocationCountryName).HasMaxLength(255);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.OwnerId).HasColumnName("OwnerID");

                entity.Property(e => e.Phone).HasMaxLength(25);

                entity.Property(e => e.Skype).HasMaxLength(50);

                entity.Property(e => e.Snapchat).HasMaxLength(50);

                entity.Property(e => e.StreetAddress)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Twitter).HasMaxLength(255);

                entity.Property(e => e.Website).HasMaxLength(255);

                entity.Property(e => e.Whatsapp).HasMaxLength(50);

                entity.Property(e => e.Youtube).HasMaxLength(255);
            });

            modelBuilder.Entity<GymReview>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.GymId).HasColumnName("GymID");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ReviewerId).HasColumnName("ReviewerID");

                entity.Property(e => e.Title).HasMaxLength(255);
            });

            modelBuilder.Entity<ItemAccessory>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Postage).HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");

                entity.Property(e => e.SizeL).HasColumnName("Size_L");

                entity.Property(e => e.SizeM).HasColumnName("Size_M");

                entity.Property(e => e.SizeNa).HasColumnName("Size_NA");

                entity.Property(e => e.SizeS).HasColumnName("Size_S");
            });

            modelBuilder.Entity<ItemBars>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<ItemBeltSleeve>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");

                entity.Property(e => e.Size2xl).HasColumnName("Size_2XL");

                entity.Property(e => e.Size3xl).HasColumnName("Size_3XL");

                entity.Property(e => e.Size4xl).HasColumnName("Size_4XL");

                entity.Property(e => e.Size5xl).HasColumnName("Size_5XL");

                entity.Property(e => e.SizeL).HasColumnName("Size_L");

                entity.Property(e => e.SizeM).HasColumnName("Size_M");

                entity.Property(e => e.SizeS).HasColumnName("Size_S");

                entity.Property(e => e.SizeXl).HasColumnName("Size_XL");

                entity.Property(e => e.SizeXs).HasColumnName("Size_XS");

                entity.Property(e => e.SizeXxs).HasColumnName("Size_XXS");

                entity.Property(e => e.SizeXxxs).HasColumnName("Size_XXXS");
            });

            modelBuilder.Entity<ItemClothing>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Postage).HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");

                entity.Property(e => e.Size2xl).HasColumnName("Size_2XL");

                entity.Property(e => e.Size3xl).HasColumnName("Size_3XL");

                entity.Property(e => e.Size4xl).HasColumnName("Size_4XL");

                entity.Property(e => e.Size5xl).HasColumnName("Size_5XL");

                entity.Property(e => e.SizeL).HasColumnName("Size_L");

                entity.Property(e => e.SizeM).HasColumnName("Size_M");

                entity.Property(e => e.SizeS).HasColumnName("Size_S");

                entity.Property(e => e.SizeXl).HasColumnName("Size_XL");

                entity.Property(e => e.SizeXs).HasColumnName("Size_XS");
            });

            modelBuilder.Entity<ItemCoachClass>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.LocationCityId).HasColumnName("LocationCityID");

                entity.Property(e => e.LocationCountryId).HasColumnName("LocationCountryID");

                entity.Property(e => e.Mma).HasColumnName("MMA");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<ItemFootwear>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Postage).HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");

                entity.Property(e => e.Size1).HasColumnName("Size_1");

                entity.Property(e => e.Size10).HasColumnName("Size_10");

                entity.Property(e => e.Size11).HasColumnName("Size_11");

                entity.Property(e => e.Size12).HasColumnName("Size_12");

                entity.Property(e => e.Size13).HasColumnName("Size_13");

                entity.Property(e => e.Size14).HasColumnName("Size_14");

                entity.Property(e => e.Size15).HasColumnName("Size_15");

                entity.Property(e => e.Size16).HasColumnName("Size_16");

                entity.Property(e => e.Size2).HasColumnName("Size_2");

                entity.Property(e => e.Size3).HasColumnName("Size_3");

                entity.Property(e => e.Size4).HasColumnName("Size_4");

                entity.Property(e => e.Size5).HasColumnName("Size_5");

                entity.Property(e => e.Size6).HasColumnName("Size_6");

                entity.Property(e => e.Size7).HasColumnName("Size_7");

                entity.Property(e => e.Size8).HasColumnName("Size_8");

                entity.Property(e => e.Size9).HasColumnName("Size_9");
            });

            modelBuilder.Entity<ItemGeneral>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<ItemGym>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.LocationCityId).HasColumnName("LocationCityID");

                entity.Property(e => e.LocationCountryId).HasColumnName("LocationCountryID");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<ItemResistanceMachine>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<ItemShaker>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");

                entity.Property(e => e.SizeMl).HasColumnName("Size_ml");
            });

            modelBuilder.Entity<ItemSupplement>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Flavour).HasMaxLength(50);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<ItemWeights>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.CategoryPathName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.SellerId).HasColumnName("SellerID");
            });

            modelBuilder.Entity<NewsFeedComment>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AuthorId).HasColumnName("AuthorID");

                entity.Property(e => e.Comment)
                    .IsRequired()
                    .HasMaxLength(1024);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.PostId).HasColumnName("PostID");
            });

            modelBuilder.Entity<NewsFeedPost>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.ImageUrl)
                    .HasColumnName("ImageURL")
                    .HasMaxLength(255);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.PostDate).HasColumnType("datetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.VideoUrl)
                    .HasColumnName("VideoURL")
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Seller>(entity =>
            {
                entity.HasIndex(e => e.ShopName)
                    .HasName("UQ__Shop__649A7D960436A412")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CityId).HasColumnName("CityID");

                entity.Property(e => e.CityName).HasMaxLength(255);

                entity.Property(e => e.ContactPerson)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.CountryId).HasColumnName("CountryID");

                entity.Property(e => e.CountryName).HasMaxLength(255);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.ShopName)
                    .IsRequired()
                    .HasMaxLength(512);
            });

            modelBuilder.Entity<ShoeSize>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AustraliaF).HasColumnName("Australia_F");

                entity.Property(e => e.AustraliaM).HasColumnName("Australia_M");

                entity.Property(e => e.JapanF).HasColumnName("Japan_F");

                entity.Property(e => e.JapanM).HasColumnName("Japan_M");

                entity.Property(e => e.UkF).HasColumnName("UK_F");

                entity.Property(e => e.UkM).HasColumnName("UK_M");

                entity.Property(e => e.UscanadaF).HasColumnName("USCanada_F");

                entity.Property(e => e.UscanadaM).HasColumnName("USCanada_M");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AdminId).HasColumnName("Admin_ID");

                entity.Property(e => e.CityId).HasColumnName("CityID");

                entity.Property(e => e.CityName).HasMaxLength(255);

                entity.Property(e => e.CoachBodybuilding).HasColumnName("Coach_Bodybuilding");

                entity.Property(e => e.CoachClasses).HasColumnName("Coach_Classes");

                entity.Property(e => e.CoachCrossfit).HasColumnName("Coach_Crossfit");

                entity.Property(e => e.CoachDance).HasColumnName("Coach_Dance");

                entity.Property(e => e.CoachMasseuse).HasColumnName("Coach_Masseuse");

                entity.Property(e => e.CoachNutrition).HasColumnName("Coach_Nutrition");

                entity.Property(e => e.CoachOlympicLifting).HasColumnName("Coach_OlympicLifting");

                entity.Property(e => e.CoachOneOnOne).HasColumnName("Coach_OneOnOne");

                entity.Property(e => e.CoachOnlineAvailable).HasColumnName("Coach_OnlineAvailable");

                entity.Property(e => e.CoachOnlineOnly).HasColumnName("Coach_OnlineOnly");

                entity.Property(e => e.CoachOther).HasColumnName("Coach_Other");

                entity.Property(e => e.CoachPhysio).HasColumnName("Coach_Physio");

                entity.Property(e => e.CoachPowerlifting).HasColumnName("Coach_Powerlifting");

                entity.Property(e => e.CoachProgramOnly).HasColumnName("Coach_ProgramOnly");

                entity.Property(e => e.CoachStrongman).HasColumnName("Coach_Strongman");

                entity.Property(e => e.CoachWeightLoss).HasColumnName("Coach_WeightLoss");

                entity.Property(e => e.CountryId).HasColumnName("CountryID");

                entity.Property(e => e.CountryName).HasMaxLength(255);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Facebook).HasMaxLength(150);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.GooglePlus).HasMaxLength(255);

                entity.Property(e => e.Instagram).HasMaxLength(255);

                entity.Property(e => e.LastName).HasMaxLength(50);

                entity.Property(e => e.Linkedin).HasMaxLength(255);

                entity.Property(e => e.Mma).HasColumnName("MMA");

                entity.Property(e => e.ModifedDate).HasColumnType("datetime");

                entity.Property(e => e.Phone).HasMaxLength(30);

                entity.Property(e => e.ProfilePic).HasMaxLength(255);

                entity.Property(e => e.ShopId).HasColumnName("Shop_ID");

                entity.Property(e => e.Skype).HasMaxLength(50);

                entity.Property(e => e.Snapchat).HasMaxLength(50);

                entity.Property(e => e.Twitter).HasMaxLength(100);

                entity.Property(e => e.Username).HasMaxLength(255);

                entity.Property(e => e.Website).HasMaxLength(512);

                entity.Property(e => e.Whatsapp).HasMaxLength(50);

                entity.Property(e => e.Youtube).HasMaxLength(150);
            });
        }
    }
}
