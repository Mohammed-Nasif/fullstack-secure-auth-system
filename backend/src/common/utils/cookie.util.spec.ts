import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { 
  getAccessTokenCookieConfig, 
  getRefreshTokenCookieConfig, 
  getClearCookieConfig,
  CookieConfig 
} from './cookie.util';

describe('CookieUtil', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: { [key: string]: string } = {
                'NODE_ENV': 'test',
                'JWT_EXPIRES_IN': '1h',
                'JWT_REFRESH_EXPIRES_IN': '7d',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getAccessTokenCookieConfig', () => {
    it('should return secure cookie config for production', () => {
      // Mock ConfigService to return 'production'
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'production',
            'JWT_EXPIRES_IN': '1h',
          };
          return config[key];
        }),
      } as any;

      const config = getAccessTokenCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600000, // 1 hour in milliseconds
      });
    });

    it('should return non-secure cookie config for development', () => {
      // Mock ConfigService to return 'development'
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'development',
            'JWT_EXPIRES_IN': '1h',
          };
          return config[key];
        }),
      } as any;

      const config = getAccessTokenCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000, // 1 hour in milliseconds
      });
    });

    it('should return non-secure cookie config for test environment', () => {
      // Mock ConfigService to return 'test'
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'test',
            'JWT_EXPIRES_IN': '1h',
          };
          return config[key];
        }),
      } as any;

      const config = getAccessTokenCookieConfig(mockConfigService);
      
      expect(config.secure).toBe(false);
      expect(config.httpOnly).toBe(true);
      expect(config.sameSite).toBe('lax');
      expect(config.maxAge).toBe(3600000);
    });

    it('should use JWT_EXPIRES_IN from config', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'test',
            'JWT_EXPIRES_IN': '2h',
          };
          return config[key];
        }),
      } as any;

      const config = getAccessTokenCookieConfig(mockConfigService);
      expect(config.maxAge).toBe(7200000); // 2 hours in milliseconds
      
      // Verify ConfigService was called with correct keys
      expect(mockConfigService.get).toHaveBeenCalledWith('NODE_ENV');
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_EXPIRES_IN');
    });

    it('should default to development behavior when NODE_ENV is not set', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string | undefined } = {
            'NODE_ENV': undefined, // Simulate missing NODE_ENV
            'JWT_EXPIRES_IN': '1h',
          };
          return config[key];
        }),
      } as any;

      const config = getAccessTokenCookieConfig(mockConfigService);
      expect(config.secure).toBe(false); // Should default to non-secure
    });
  });

  describe('getRefreshTokenCookieConfig', () => {
    it('should return secure cookie config for production', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'production',
            'JWT_REFRESH_EXPIRES_IN': '7d',
          };
          return config[key];
        }),
      } as any;

      const config = getRefreshTokenCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 604800000, // 7 days in milliseconds
      });
    });

    it('should return non-secure cookie config for development', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'development',
            'JWT_REFRESH_EXPIRES_IN': '7d',
          };
          return config[key];
        }),
      } as any;

      const config = getRefreshTokenCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 604800000, // 7 days in milliseconds
      });
    });

    it('should use JWT_REFRESH_EXPIRES_IN from config', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'test',
            'JWT_REFRESH_EXPIRES_IN': '14d',
          };
          return config[key];
        }),
      } as any;

      const config = getRefreshTokenCookieConfig(mockConfigService);
      expect(config.maxAge).toBe(1209600000); // 14 days in milliseconds
      
      // Verify ConfigService was called with correct keys
      expect(mockConfigService.get).toHaveBeenCalledWith('NODE_ENV');
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_REFRESH_EXPIRES_IN');
    });
  });

  describe('getClearCookieConfig', () => {
    it('should return config to clear cookies in test environment', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'test',
          };
          return config[key];
        }),
      } as any;

      const config = getClearCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
    });

    it('should return secure config for production environment', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'production',
          };
          return config[key];
        }),
      } as any;

      const config = getClearCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    });

    it('should return non-secure config for development environment', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'development',
          };
          return config[key];
        }),
      } as any;

      const config = getClearCookieConfig(mockConfigService);
      
      expect(config).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
    });

    it('should not include maxAge (for proper cookie clearing)', () => {
      const mockConfigService = {
        get: jest.fn(() => 'test'),
      } as any;

      const config = getClearCookieConfig(mockConfigService);
      expect(config.maxAge).toBeUndefined();
    });

    it('should verify ConfigService is called for NODE_ENV', () => {
      const mockConfigService = {
        get: jest.fn(() => 'test'),
      } as any;

      getClearCookieConfig(mockConfigService);
      expect(mockConfigService.get).toHaveBeenCalledWith('NODE_ENV');
    });
  });

  describe('CookieConfig interface compliance', () => {
    it('should return objects that match CookieConfig interface', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          const config: { [key: string]: string } = {
            'NODE_ENV': 'test',
            'JWT_EXPIRES_IN': '1h',
            'JWT_REFRESH_EXPIRES_IN': '7d',
          };
          return config[key];
        }),
      } as any;

      const accessConfig = getAccessTokenCookieConfig(mockConfigService);
      const refreshConfig = getRefreshTokenCookieConfig(mockConfigService);
      
      // Check that all required properties exist
      expect(typeof accessConfig.httpOnly).toBe('boolean');
      expect(typeof accessConfig.maxAge).toBe('number');
      expect(['lax', 'strict', 'none']).toContain(accessConfig.sameSite);
      expect(typeof accessConfig.secure).toBe('boolean');
      
      expect(typeof refreshConfig.httpOnly).toBe('boolean');
      expect(typeof refreshConfig.maxAge).toBe('number');
      expect(['lax', 'strict', 'none']).toContain(refreshConfig.sameSite);
      expect(typeof refreshConfig.secure).toBe('boolean');
    });
  });

  describe('ConfigService integration', () => {
    it('should call ConfigService.get with correct parameters', () => {
      const spy = jest.spyOn(configService, 'get');
      
      getAccessTokenCookieConfig(configService);
      
      expect(spy).toHaveBeenCalledWith('NODE_ENV');
      expect(spy).toHaveBeenCalledWith('JWT_EXPIRES_IN');
    });

    it('should handle missing JWT_EXPIRES_IN gracefully', () => {
      const mockConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'NODE_ENV') return 'test';
          if (key === 'JWT_EXPIRES_IN') return undefined; // Missing JWT config
          return undefined;
        }),
      } as any;

      expect(() => {
        getAccessTokenCookieConfig(mockConfigService);
      }).toThrow('Invalid duration: expected non-empty string'); // This is expected behavior

      // Test with default fallback
      const mockConfigServiceWithDefaults = {
        get: jest.fn((key: string) => {
          if (key === 'NODE_ENV') return 'test';
          if (key === 'JWT_EXPIRES_IN') return '1h'; // Provide default
          return undefined;
        }),
      } as any;

      expect(() => {
        getAccessTokenCookieConfig(mockConfigServiceWithDefaults);
      }).not.toThrow();
      
      const config = getAccessTokenCookieConfig(mockConfigServiceWithDefaults);
      expect(config.secure).toBe(false);
    });
  });
});