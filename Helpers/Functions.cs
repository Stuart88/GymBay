using GeoAPI.Geometries;
using GymBay.Models.DbClasses;
using ImageMagick;
using Microsoft.AspNetCore.Http;
using NetTopologySuite;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace GymBay.Helpers
{
    public static class Functions
    {
        public static string ErrorMessage(Exception e)
        {
            return e.Message + (e.InnerException != null ? e.InnerException.Message : "") + (e.InnerException != null && e.InnerException.InnerException != null ? e.InnerException.InnerException.Message : ""); ;
        }

        public static void CheckNull(object obj)
        {
            if (obj == null)
                throw new Exception("Null object found!");
        }

        public static string GetImagePath(string folderPathEnd, int imageID)
        {
            string currentDir = Environment.CurrentDirectory;

            string webFolder = "\\dist\\uploads\\images\\" + folderPathEnd;

            string imageName = imageID.ToString() + ".jpg";
             
            string rootPath = CreateRootPath(folderPathEnd, imageName);

            if (File.Exists(rootPath))
            {
                return Path.Combine(webFolder, imageName);
            }
            else
            {
                return "dist/images/General/default_candidate_avatar.png";
            }
        }

        /// <summary>
        /// returns root path in the form RootDirectoy/wwwroot/dist/uploads/{folderPathEnd}/{fileName (include extension) }
        /// </summary>
        /// <param name="folderPathEnd"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string CreateRootPath(string folderPathEnd, string fileName)
        {
            return Path.Combine(Environment.CurrentDirectory, "wwwroot", "\\dist\\uploads\\", folderPathEnd, fileName);
        }

        public static byte[] ConvertToBytes(IFormFile file)
        {
            byte[] CoverImageBytes = null;
            using (BinaryReader reader = new BinaryReader(file.OpenReadStream()))
            {
                CoverImageBytes = reader.ReadBytes((int)file.Length);
            }
            return CoverImageBytes;
        }

        /// <summary> 
        /// Returns a cropped version of the given image.
        /// All parameters are pixel values based on user's screen.
        /// imgW is compared against the width of the actual image stored in the database, 
        /// to make a ratio which is used to scale all other parameters accordingly.
        /// A Rectangle object is then use to set an area from which to crop from the full image.
        /// Returns cropped image to save in database.
        /// </summary>
        public static byte[] CropImage(byte[] imgBytes, int x, int y, int width, int height)
        {
            //ensure the values can be properly worked with
            if (imgBytes == null || imgBytes.Length == 0 || x < 0 || y < 0 || width <= 0 || height <= 0)
                return new byte[0];

            MagickImage image = new MagickImage(imgBytes);

            if (x > image.Width || y > image.Height)
                return new byte[0];

            image.Crop(new MagickGeometry(x, y, width, height));
            image.Page = new MagickGeometry(0, 0, width, height);

            return image.ToByteArray();
        }

        /// <summary>
        /// Attempts to reduce given image to less than desired size. 
        /// </summary>
        /// <param name="image">Image to reduce</param>
        /// <param name="desiredSize">Desired size (bytes)</param>
        public static void ReduceImageQuality(ref byte[] image, int desiredSize)
        {
            if (desiredSize > 0)
            {
                MagickImage magickImage = new MagickImage(image)
                {
                    Format = MagickFormat.Jpg,
                    Quality = 100
                };

                while (magickImage.ToByteArray().Length > desiredSize)
                {
                    magickImage.Quality -= 5;
                    if (magickImage.Quality < 6)
                    {
                        break;
                    }
                }

                image = magickImage.ToByteArray();
            }
                
        }

        public static bool AdminLoggedIn(HttpRequest request, out User user)
        {
            user = new User();

            try
            {
                using (GymBayContext db = new GymBayContext())
                {
                   
                    string sessionID = "";
                    int userID = 0;
                    if (request.Cookies["AdminUserID"] != null)
                    {
                        userID = int.Parse(request.Cookies["AdminUserID"]);
                    }

                    user = db.User.Find(userID);
                   
                    if (request.Cookies["AdminSessionID"] != null)
                    {
                        sessionID = request.Cookies["AdminSessionID"];
                    }

                    if (user == null)
                        throw new Exception("User not found!");

                    if (user.SessionToken != sessionID)
                        throw new Exception("Not logged in!");

                    return true;
                }

            }
            catch (Exception)
            {
                return false;
            }
        }

        public static bool UserLoggedIn(HttpRequest request, out User user)
        {
            user = new User();

            try
            {
                using (GymBayContext db = new GymBayContext())
                {

                    string sessionID = "";
                    int userID = 0;
                    if (request.Cookies["UserID"] != null)
                    {
                        userID = int.Parse(request.Cookies["UserID"]);
                    }

                    user = db.User.Find(userID);

                    if (request.Cookies["SessionID"] != null)
                    {
                        sessionID = request.Cookies["SessionID"];
                    }

                    if (user == null)
                        throw new Exception("User not found!");

                    if (user.SessionToken != sessionID)
                        throw new Exception("Not logged in!");

                    return true;
                }

            }
            catch (Exception)
            {
                return false;
            }
        }
        public static bool CheckAuthorisation(string authorisation, out string email, out string password)
        {
            if (authorisation != null && authorisation.StartsWith("Basic"))
            {
                string encodedEmailPassword = authorisation.Substring("Basic ".Length).Trim();
                Encoding encoding = Encoding.GetEncoding("iso-8859-1");
                List<string> emailPassword = encoding.GetString(Convert.FromBase64String(encodedEmailPassword)).Split(':').ToList();
                email = emailPassword[0];
                password = emailPassword[1];
                return true;
            }
            else
            {
                email = "";
                password = "";
                return false;
            }
        }

        private static char[] digits = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' };
        public static string RandomString(int length)
        {
            Random rand = new Random();
            string randString = "";

            int i = 0;
            while (i < length)
            {
                randString += digits[rand.Next(digits.Count())];
                i++;
            }

            return randString;
        }
        public static bool IsEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
        public static string GetEmailHandle(string email)
        {
            string handle = "";
            foreach (char c in email)
            {
                if (c == '@')
                    break;
                else
                    handle += c;
            }

            return handle;
        }
        public static string MakeUrlSafe(string url, bool forSiteMap = false)
        {
            if (forSiteMap)
            {//sitemap libary performs url encoding autamtically, but it's ugly, with loads of %%FF334 like that so change the most common econoded characters to '-'
             //This is only used in arbitrary page titles (blog title, job title, resource title etc), so will never effect any required URL parameters

                return url.Replace(' ', '-').Replace('?', '-').Replace(';', '-')
                    .Replace('/', '-').Replace(':', '-').Replace('@', '-').Replace('&', '-')
                    .Replace('=', '-').Replace('+', '-').Replace('$', '-').Replace(',', '-');
            }
            else
            {
                return System.Web.HttpUtility.UrlEncode(url.Replace(' ', '-'));
            }
        }
        public static void ErrorLogger(string errorLocation, Exception exception)
        {
            try
            {
                string exceptionString = exception.Message + (exception.InnerException != null ? exception.InnerException.Message : "");
                string appPath = Path.Combine(Environment.CurrentDirectory, "wwwroot", "errorLogs");

                if (!Directory.Exists(appPath))
                {
                    Directory.CreateDirectory(appPath);
                }

                string filePath = Path.Combine(appPath, DateTime.Now.ToShortDateString().Replace('/', '-').Replace(':', '-') + ".txt");

                if (!File.Exists(filePath))
                {
                    File.CreateText(filePath).Dispose();
                }

                using (StreamWriter file = new StreamWriter(filePath, true))
                {
                    file.WriteLine(string.Format("Error at {0}: {1}", errorLocation, exceptionString));
                }

            }
            catch (Exception ex)
            {
                string error = ex.Message + (ex.InnerException == null ? "" : ex.InnerException.Message);
            }
        }

        public static string StripHTML(string inputString)
        {
            string HTML_TAG_PATTERN = "<.*?>";

            return Regex.Replace(inputString, HTML_TAG_PATTERN, string.Empty);
        }
    }
}
