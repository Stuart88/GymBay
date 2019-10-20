using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GymBay.Helpers;
using GymBay.Models;
using GymBay.Models.DbClasses;
using GymBay.Models.General;
using Microsoft.AspNetCore.Mvc;

namespace GymBay.Controllers
{
    [Route("api/Shops")]
    public class ShopController : Controller
    {
        readonly GymBayContext db = new GymBayContext();

        [HttpGet("GetAllShops")]
        public IEnumerable<Seller> GetAllShops()
        {
            return db.Seller.AsEnumerable();
        }

        [HttpPost("AddUpdateShopAsync")]
        public async Task<HttpResult> AddUpdateShopAsync([FromBody] Seller shop)
        {
            try
            {
                DateTime now = DateTime.Now;

                if (shop.Id > 1)
                {
                    Seller updating = db.Seller.Find(shop.Id);
                    Functions.CheckNull(updating);

                    updating.ContactPerson = shop.ContactPerson;
                    updating.ModifiedDate = now;
                    updating.Phone = shop.Phone;
                    updating.ShopName = shop.ShopName;
                    updating.Status = shop.Status;
                    updating.CityId = shop.Id;
                    updating.CountryId = shop.Id;

                    updating.CityName = db.CityGeo.Find(shop.CityId).CityName;
                    updating.CountryName = db.CountryGeo.Find(shop.CountryId).CountryName;

                    db.Entry(updating).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                    await db.SaveChangesAsync();

                    return new HttpResult(true, null, "");
                }
                else
                {
                    shop.CreationDate = now;
                    shop.ModifiedDate = now;
                    shop.CityName = db.CityGeo.Find(shop.CityId).CityName;
                    shop.CountryName = db.CityGeo.Find(shop.CountryId).CountryName;

                    db.Seller.Add(shop);

                    await db.SaveChangesAsync();

                    return new HttpResult(true, shop, "");
                }
            }
            catch(Exception e)
            {
                return new HttpResult(false, null, Functions.ErrorMessage(e));
            }
           
        }

        [HttpGet("ProfilePicture/{shopID}")]
        public IActionResult ProfilePicture(int shopID)
        {
            return File(Functions.GetImagePath("shops\\profiles", shopID), "image/png");
        }


    }
}
