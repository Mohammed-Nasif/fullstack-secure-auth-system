import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  /**
   * Creates and saves a new user document.
   * @param createUserDto Data Transfer Object for user creation
   * @returns Created User document
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  /**
   * Finds a user by email.
   * @param email User's email address
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  /**
   * Finds a user by their unique MongoDB ID.
   * @param id User ID
   * @returns User document or null
   */
  async findById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }

  /**
   * Checks if a user with the given email exists.
   * @param email User's email address
   * @returns true if user exists, false otherwise
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.exists({ email });
    return !!user;
  }
}
