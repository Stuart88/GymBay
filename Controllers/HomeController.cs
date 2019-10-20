using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static GymBay.Controllers.UserController;

namespace GymBay.Controllers
{
    public class HomeController : Controller
    {
        readonly GymBayContext db = new GymBayContext();
        public async Task<IActionResult> Index()
        {
            if (Request.QueryString.Value.Contains("code"))
            {
                string linkedInOuthCode = Request.Query["code"];

                return await LinkedInLogin("", linkedInOuthCode);

            }
            return View(Request);
        }

        public async Task<IActionResult> LinkedInLogin(string redirectURL, string code)
        {
            BasicRegistrationDetails model = new BasicRegistrationDetails();

            bool linkedInLogin = !string.IsNullOrEmpty(code);


            if (linkedInLogin)
            {
                model = await ProcessLinkedInLogin(code);
                redirectURL = "";
            }
            else
            {
                return View(Request);
            }

            User loggingIn;

            if (db.User.Any(x => x.Email == model.Email))
            {
                loggingIn = db.User.FirstOrDefault(x => x.Email == model.Email);
            }
            else if (!Functions.IsEmail(model.Email))
            {
                return View(Request);
            }
            else
            {
                loggingIn = await CreateNewUser(model);
            }

            loggingIn.SessionToken = Functions.RandomString(40);

            db.Entry(loggingIn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

            Response.Cookies.Append("UserID", loggingIn.Id.ToString());
            Response.Cookies.Append("SessionID", loggingIn.SessionToken);

            await db.SaveChangesAsync();

            return View(Request);

        }

        public async Task<BasicRegistrationDetails> ProcessLinkedInLogin(string code)
        {
            try
            {
                BasicRegistrationDetails model = new BasicRegistrationDetails();

                HttpClient client = new HttpClient();
                //client.DefaultRequestHeaders.Add("Content-Type", "x-www-form-urlencoded");

                string redirect = Request.Host.HasValue && Request.Host.Host == "localhost"
                    ? "http://localhost:59850/"
                    : "https://gym-bay.com";

                Dictionary<string, string> parameters = new Dictionary<string, string>
                {
                    { "grant_type", "authorization_code" },
                    { "code", code },
                    { "redirect_uri", redirect },
                    { "client_id", "81jgok12c4g7jl" },
                    { "client_secret", "iBRWgS57GiNZCBCU" }
                };



                var content = new FormUrlEncodedContent(parameters);

                var postResponse = await client.PostAsync("https://www.linkedin.com/oauth/v2/accessToken", content);

                string responseString = await postResponse.Content.ReadAsStringAsync();
                dynamic responseObject = JsonConvert.DeserializeObject(responseString);
                string accessToken = responseObject["access_token"];
                string expires_seconds = responseObject["expires_in"];

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var dataRequest = await client.GetAsync("https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))");

                string dataString = await dataRequest.Content.ReadAsStringAsync();
                dynamic responseObject_2 = JsonConvert.DeserializeObject(dataString);

                model.FirstName = responseObject_2["firstName"]["localized"]["en_US"] ?? "";
                model.LastName = responseObject_2["lastName"]["localized"]["en_US"] ?? "";



                var emailRequest = await client.GetAsync("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))");
                string emailString = await emailRequest.Content.ReadAsStringAsync();
                dynamic emailResponseObject = JsonConvert.DeserializeObject(emailString);

                string email = emailResponseObject["elements"][0]["handle~"]["emailAddress"] ?? "";

                model.Email = email;

                return model;
            }
            catch (Exception)
            {

                return new BasicRegistrationDetails();
            }
        }

        //public class LoginModel
        //{
        //    public string Email { get; set; } //email/username for login. If new signup, this stores the email only.
        //    public string UserType { get; set; }
        //    public string Username { get; set; }
        //}

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View(Request);
        }

        
    }
}
