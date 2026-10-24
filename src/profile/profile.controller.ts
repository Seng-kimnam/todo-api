import { Controller, Get, Body, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}


  @Get()
  @HttpCode(HttpStatus.OK)
  getProfile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

 
  @Patch()
  @HttpCode(HttpStatus.OK)
  updateProfile(@Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return this.profileService.updateProfile(updateProfileDto);
  }
}
