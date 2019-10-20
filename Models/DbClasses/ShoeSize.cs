using System;
using System.Collections.Generic;

namespace GymBay.Models.DbClasses
{
    public partial class ShoeSize
    {
        public int Id { get; set; }
        public double Europe { get; set; }
        public double? Mexico { get; set; }
        public double JapanM { get; set; }
        public double JapanF { get; set; }
        public double UkM { get; set; }
        public double UkF { get; set; }
        public double AustraliaM { get; set; }
        public double AustraliaF { get; set; }
        public double UscanadaM { get; set; }
        public double UscanadaF { get; set; }
        public double? RussiaUkraine { get; set; }
        public double Korea { get; set; }
        public double Inches { get; set; }
        public double Cm { get; set; }
        public double Mondopoint { get; set; }
    }
}
