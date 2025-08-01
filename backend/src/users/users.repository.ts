import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from '../auth/dtos/signup.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  /**
   * Creates and saves a new user document.
   * @param SignupDto Data Transfer Object for user creation
   * @returns Created User document
   * @throws {MongoError} If validation fails or duplicate key constraint is violated
   */
  async create(SignupDto: SignupDto): Promise<UserDocument> {
    return await this.userModel.create(SignupDto);
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
   * Updates the hashed refresh token for a specific user.
   * @param userId - The unique identifier of the user whose refresh token is to be updated.
   * @param hashedRt - The new hashed refresh token to store for the user.
   * @returns A promise that resolves when the update operation is complete.
   */
  async updateRefreshToken(userId: string, hashedRt: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(
      userId, 
      { hashedRefreshToken: hashedRt },
      { new: true }
    );
  }

  /**
   * Removes the hashed refresh token for a user by setting it to null.
   * @param userId - The unique identifier of the user whose refresh token should be removed.
   * @returns A promise that resolves when the operation is complete.
   */
  async removeRefreshToken(userId: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(
      userId, 
      { hashedRefreshToken: null },
      { new: true }
    );
  }
}
