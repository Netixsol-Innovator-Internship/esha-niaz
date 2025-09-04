// import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../common/guards/roles.guard';
// import { Roles } from '../common/decorators/roles.decorator';
// import { Role } from '../common/types/role.enum';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { GetUser } from '../common/decorators/user.decorator';
// import { VerifiedGuard } from '../common/guards/verified.guard';
// import { UpdateProfileDto } from './dto/update-profile.dto';

// @Controller('users')
// @UseGuards(JwtAuthGuard, VerifiedGuard, RolesGuard)
// export class UsersController {
//   constructor(private users: UsersService) {}

//   @Get('me')
//   @Roles(Role.User, Role.Admin, Role.SuperAdmin)
//   async me(@GetUser() user: any) {
//     const profile = await this.users.findById(user.id);
//     return { ...profile, passwordHash: undefined };
//   }

//   @Get()
//   @Roles(Role.Admin, Role.SuperAdmin)
//   listUsers() {
//     return this.users.listUsers();
//   }

//   @Patch('role')
//   @Roles(Role.SuperAdmin)
//   setRole(@Body() dto: UpdateRoleDto) {
//     return this.users.updateRole(dto.userId, dto.role);
//   }

//   @Patch('me')
//   @Roles(Role.User, Role.Admin, Role.SuperAdmin)
//   updateProfile(@GetUser() user: any, @Body() dto: UpdateProfileDto) {
//     return this.users.updateProfile(user.id, dto);
//   }
// }




import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/types/role.enum';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetUser } from '../common/decorators/user.decorator';
import { VerifiedGuard } from '../common/guards/verified.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, VerifiedGuard, RolesGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned successfully.' })
  me(@GetUser() user: any) {
    return this.users.findById(user.id);
  }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  listUsers() {
    return this.users.listUsers();
  }

  @Patch('role')
  @Roles(Role.SuperAdmin)
  @ApiOperation({ summary: 'Update user role (SuperAdmin only)' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  setRole(@Body() dto: UpdateRoleDto) {
    return this.users.updateRole(dto.userId, dto.role);
  }

  @Patch('me')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update own profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  updateProfile(@GetUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }
}
