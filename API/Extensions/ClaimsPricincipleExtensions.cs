using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPricincipleExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            var userDetails = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // just safe side added check as of now.
            if(userDetails != null)
            {
                return int.Parse(userDetails);
            }
            else return 1;
        }
    }
}