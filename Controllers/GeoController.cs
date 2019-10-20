using GymBay.Helpers;
using GymBay.Models.DbClasses;
using GymBay.Models.Geo;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GymBay.Controllers
{
    [Route("api/Geo")]
    public class GeoController : Controller
    {
        #region Private Fields

        private readonly GymBayContext db = new GymBayContext();

        #endregion Private Fields

        #region Public Methods

        [HttpGet("GetCountries")]
        public IEnumerable<CountryGeo> GetCountries()
        {
            return db.CountryGeo.OrderBy(x => x.CountryName).AsEnumerable();
        }

        [HttpGet("QueryCities")]
        public IEnumerable<CityGeoBasic> QueryCities([FromQuery] string q)
        {
            if (!string.IsNullOrEmpty(q))
            {
                //List<string> qList = q.ToLower()
                //                .Replace(',', ' ')
                //                .Split(' ')
                //                .Where(s => !string.IsNullOrEmpty(s))
                //                .ToList();

                var result = (from c in db.CityGeoBasic
                              where c.CityName.ToLower().Contains(q.ToLower().Trim())
                              select c)
                              //.OrderByDescending(x => x.CityName.ToLower() == q)
                              //.OrderByDescending(x => x.CityName.ToLower().StartsWith(q))
                              //.ThenBy(x => x.CityName)
                              .Take(100);

                return result;
            }
            else
            {
                return new List<CityGeoBasic>();
            }
        }

        [HttpGet("SearchCities")]
        public IEnumerable<CitySearchResult> SearchCities([FromQuery]int countryID)
        {
            string countryName = "";
            if (countryID > 0)
            {
                countryName = db.CountryGeo.Find(countryID).CountryName;
            }
            bool noCountry = countryID == 0;

            //int takeAmount = noCity ? 5 : 20;

            List<CitySearchResult> cities;
            try
            {//need try catch because it keeps timing out on this search...
                cities = (from c in db.CityGeoBasic
                          where (c.CountryName == countryName || noCountry)
                          select new CitySearchResult
                          {
                              CityID = c.Id,
                              CityName = c.CityName,
                              NearestCity = c.NearestCity
                          })
                         .OrderBy(x => x.CityName)
                         .ToList();
            }
            catch (Exception e)
            {
                cities = new List<CitySearchResult>
                {
                    new CitySearchResult
                    {
                        CityID = 0,
                        CityName = "Error!",
                        NearestCity = Functions.ErrorMessage(e)
                    }
                };
            }

            return cities;
        }

        #endregion Public Methods

        //[HttpGet("CityMake")]
        //public async Task<HttpResult> CityMake()
        //{
        //    System.Diagnostics.Debug.WriteLine("Starting city make...");

        //    GeoAPI.Geometries.IGeometryFactory geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);

        //    CityGeo[] allCities = db.CityGeo.OrderBy(x => x.CountryName).ToArray();
        //    CityGeo[] allCitiesFilterd = {  };

        //    List<CityGeoBasic> basicCities = new List<CityGeoBasic>();
        //    int counter = 0;
        //    string currentCountry = "";
        //    foreach (var c in allCities)
        //    {
        //        counter++;

        //        //onyl need refresh filtered list if country has changed
        //        if(c.CountryName != currentCountry)
        //        {
        //            allCitiesFilterd = allCities.Where(x => x.CountryName == c.CountryName).ToArray();
        //            currentCountry = c.CountryName;
        //        }

        //        if (allCitiesFilterd.Count() == 0)
        //        {
        //            basicCities.Add(new CityGeoBasic
        //            {
        //                CityName = c.CityName,
        //                CountryName = c.CountryName,
        //                NearestCity = "",
        //                CityGeoId = c.Id
        //            });
        //        }
        //        else
        //        {
        //            GeoAPI.Geometries.IPoint cityLocation = geometryFactory.CreatePoint(new GeoAPI.Geometries.Coordinate((double)c.Latitude, (double)c.Longitude));

        //            basicCities.Add(new CityGeoBasic
        //            {
        //                CityName = c.CityName,
        //                CountryName = c.CountryName,
        //                NearestCity = (from city in allCitiesFilterd
        //                               where city.Id != c.Id
        //                               orderby new GeoAPI.Geometries.Coordinate((double)city.Latitude, (double)city.Longitude).Distance(cityLocation.Coordinate)
        //                               select city.CityName).FirstOrDefault(),
        //                CityGeoId = c.Id
        //            });
        //        }

        //        //CityGeo cCity = allCities.FirstOrDefault(x => x.Id == c.Id);

        //        if(counter%1000 == 0)
        //        {
        //            try
        //            {
        //                db.CityGeoBasic.AddRange(basicCities);
        //                await db.SaveChangesAsync();
        //                System.Diagnostics.Debug.WriteLine("Added " + counter.ToString());
        //                basicCities.Clear();
        //            }
        //            catch(Exception e)
        //            {
        //                return new HttpResult(false, null, Functions.ErrorMessage(e));
        //            }

        //        }
        //    }

        //    if(basicCities.Count() > 0)
        //    {
        //        try
        //        {
        //            db.CityGeoBasic.AddRange(basicCities);
        //            await db.SaveChangesAsync();
        //            System.Diagnostics.Debug.WriteLine("Added " + counter.ToString());
        //            basicCities.Clear();
        //        }
        //        catch (Exception e)
        //        {
        //            return new HttpResult(false, null, Functions.ErrorMessage(e));
        //        }
        //    }

        //    return new HttpResult(true, null, "Done! Added " + counter.ToString());
        //}
    }
}