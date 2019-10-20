using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using Microsoft.AspNetCore.Mvc;

namespace GymBay.Controllers
{
    [Route("api/Admin")]
    public class AdminController : Controller
    {
        readonly GymBayContext db = new GymBayContext();
        private readonly string adminPass = "gymmo123";


        [HttpPost("AdminLogin")]
        public HttpResult AdminLogin([FromHeader] string authorisation)
        {
            try
            {
                if (Functions.CheckAuthorisation(authorisation, out string email, out string adminPass))
                {

                    if (adminPass != this.adminPass)
                        throw new Exception("Password incorrect!");

                    User admin = db.User.FirstOrDefault(x => x.Email == email);
                    if (admin == null)
                        throw new Exception("Admin not found!");

                    admin.SessionToken = Functions.RandomString(40);

                    db.Entry(admin).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    Response.Cookies.Append("AdminUserID", admin.Id.ToString());
                    Response.Cookies.Append("AdminSessionID", admin.SessionToken);

                    db.SaveChanges();

                    return new HttpResult(true, null, "");
                }
                else
                {
                    return new HttpResult(false, null, "Unauthorised!");
                }
            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

        [HttpPost("AdminLogout")]
        public HttpResult AdminLogout()
        {
            try
            {
                if (Functions.AdminLoggedIn(Request, out User loggingOut))
                {
                    if (Request.Cookies["AdminUserID"] != null)
                    {
                        Response.Cookies.Delete("AdminUserID");
                    }

                    if (Request.Cookies["AdminSessionID"] != null)
                    {
                        Response.Cookies.Delete("AdminSessionID");
                    }

                    loggingOut.SessionToken = string.Empty;
                    db.Entry(loggingOut).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    db.SaveChanges();

                    return new HttpResult(true, null, "");
                }
                else
                {
                    return new HttpResult(true, null, "");
                }

            }
            catch (Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }

        }

     
       
    }

}
