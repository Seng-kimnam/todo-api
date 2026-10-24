import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

const DEFAULT_PROFILE: CreateProfileDto = {
  username: 'guest',
  displayName: 'Guest User',
  email: 'guest@example.com',
};

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getProfile(): Promise<Profile> {
    const [existing] = await this.profileRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });

    if (existing) {
      return existing;
    }

    const profile = this.profileRepository.create(DEFAULT_PROFILE);
    return await this.profileRepository.save(profile);
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getProfile();
    Object.assign(profile, updateProfileDto);
    return await this.profileRepository.save(profile);
  }
}
