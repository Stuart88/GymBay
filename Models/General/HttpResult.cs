namespace GymBay.Models.General
{
    public class HttpResult
    {
        #region Public Constructors

        public HttpResult(bool ok, object data, string msg)
        {
            this.Ok = ok;
            this.Data = data;
            this.Message = msg;
        }

        #endregion Public Constructors

        #region Public Properties

        public object Data { get; set; } = null;
        public string Message { get; set; } = "";
        public bool Ok { get; set; } = false;

        #endregion Public Properties
    }
}