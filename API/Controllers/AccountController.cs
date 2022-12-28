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
            user.UserName = registerDto.Username.ToLower();
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                    Username = user.UserName,
                    Token = _tokenService.CreateToken(user),
                    KnownAs = user.KnownAs,
                    Gender = user.Gender
            };
        }

         [HttpPost("login")]
         public async Task<ActionResult<UserDto>> Login(loginDto loginDto)
         {
            var user = await Task.Run(() =>_context.Users
            .Include(p => p.Photos)
            .FirstOrDefault(x=> x.UserName == loginDto.username));

            if(user == null)
            {
                return Unauthorized("Invalid Username");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };

         }

        private async Task<bool> IsUserExsist(string username)
        {
            return await _context.Users.AnyAsync(u => u.UserName == username.ToLower());
        }
    }
}