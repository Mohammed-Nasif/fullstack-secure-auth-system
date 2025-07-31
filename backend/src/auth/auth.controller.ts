import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { 
  getAccessTokenCookieConfig, 
  getRefreshTokenCookieConfig, 
  getClearCookieConfig,
  createSuccessResponse,
  createCreatedResponse,
  createErrorResponse,
  AUTH_MESSAGES,
  HandleErrors,
  API_ENDPOINTS 
} from '@common';

@ApiTags('Authentication')
@Controller(API_ENDPOINTS.AUTH.BASE)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 signups per minute
  @Post(API_ENDPOINTS.AUTH.SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @HandleErrors
  async signup(@Body() SignupDto: SignupDto, @Res() res: Response) {
    const { tokens, user } = await this.authService.signup(SignupDto);
    
    const accessTokenConfig = getAccessTokenCookieConfig(this.configService);
    const refreshTokenConfig = getRefreshTokenCookieConfig(this.configService);

    return res
      .cookie('access_token', tokens.access_token, accessTokenConfig)
      .cookie('refresh_token', tokens.refresh_token, refreshTokenConfig)
      .status(HttpStatus.CREATED)
      .json(createCreatedResponse(AUTH_MESSAGES.SIGNUP_SUCCESS, user));
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 login attempts per minute
  @Post(API_ENDPOINTS.AUTH.SIGNIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HandleErrors
  async signin(@Body() signInDto: SigninDto, @Res() res: Response) {
    const { access_token, refresh_token } = await this.authService.signin(signInDto);
    
    const accessTokenConfig = getAccessTokenCookieConfig(this.configService);
    const refreshTokenConfig = getRefreshTokenCookieConfig(this.configService);

    return res
      .cookie('access_token', access_token, accessTokenConfig)
      .cookie('refresh_token', refresh_token, refreshTokenConfig)
      .status(HttpStatus.OK)
      .json(createSuccessResponse(AUTH_MESSAGES.SIGNIN_SUCCESS));
  }

  @Post(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using cookie' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token' })
  @HandleErrors
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        createErrorResponse(AUTH_MESSAGES.REFRESH_TOKEN_NOT_FOUND, HttpStatus.UNAUTHORIZED)
      );
    }

    const tokens = await this.authService.refreshTokenFromCookie(refreshToken);
    
    const accessTokenConfig = getAccessTokenCookieConfig(this.configService);
    const refreshTokenConfig = getRefreshTokenCookieConfig(this.configService);

    return res
      .cookie('access_token', tokens.access_token, accessTokenConfig)
      .cookie('refresh_token', tokens.refresh_token, refreshTokenConfig)
      .status(HttpStatus.OK)
      .json(createSuccessResponse(AUTH_MESSAGES.REFRESH_SUCCESS));
  }

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINTS.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @HandleErrors
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { userId: string };
    await this.authService.logout(user.userId);

    const clearConfig = getClearCookieConfig(this.configService);

    return res
      .clearCookie('access_token', clearConfig)
      .clearCookie('refresh_token', clearConfig)
      .status(HttpStatus.OK)
      .json(createSuccessResponse(AUTH_MESSAGES.LOGOUT_SUCCESS));
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINTS.AUTH.PROFILE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile (protected endpoint)' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Req() req: Request) {
    const user = req.user as { userId: string, email: string };
    return createSuccessResponse(AUTH_MESSAGES.PROFILE_SUCCESS, {
      id: user.userId,
      email: user.email
    });
  }
}
