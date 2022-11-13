using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public IMapper _mapper { get; }
        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register (RegisterDto registerDto)
        {
            if (await IsUserExsist(registerDto.Username)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            using var hmac =  new HMACSHA512();
            
           
            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                    Username = user.UserName,
                    Token = _tokenService.CreateToken(user),
                    KnownAs = user.KnownAs
            };
        }

         [HttpPost("login")]
         public async Task<ActionResult<UserDto>> Login(loginDto loginDto)
         {
            var user = _context.Users
            .Include(p => p.Photos)
            .FirstOrDefault(x=> x.UserName == loginDto.username);

            if(user == null)
            {
                return Unauthorized("Invalid Username");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.password));

            for (int i= 0; i < computeHash.Length; i++)
            {
                if(computeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }
            
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs
            };

         }

        private async Task<bool> IsUserExsist(string username)
        {
            return await _context.Users.AnyAsync(u => u.UserName == username.ToLower());
        }
    }
}