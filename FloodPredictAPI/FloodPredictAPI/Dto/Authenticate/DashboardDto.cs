using AutoMapper;
using Microsoft.EntityFrameworkCore;
using FloodPredictAPI.Data;
using System.Collections.Generic;

namespace FloodPredictAPI.Dto
{
    public class DashboardDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Description { get; set; }
        public bool PermitAccess { get; set; } = false;
        public virtual List<FunctionDto> Functions { get; set; }
    }
}
