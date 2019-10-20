using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymBay.Models.General
{
    public class HttpResult
    {
        public HttpResult(bool ok, object data, string msg)
        {
            this.Ok = ok;
            this.Data = data;
            this.Message = msg;
        }
        public bool Ok { get; set; } = false;
        public object Data { get; set; } = null;
        public string Message { get; set; } = "";
    }
}
