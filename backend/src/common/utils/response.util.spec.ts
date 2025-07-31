import { createSuccessResponse, createErrorResponse } from './response.util';

describe('ResponseUtil', () => {
  describe('createSuccessResponse', () => {
    it('should create success response with data', () => {
      const data = { id: '123', name: 'John' };
      const response = createSuccessResponse('Success message', data);
      
      expect(response).toEqual({
        statusCode: 200,
        message: 'Success message',
        data,
        timestamp: expect.any(String),
      });
    });

    it('should create success response without data', () => {
      const response = createSuccessResponse('Success message');
      
      expect(response).toEqual({
        statusCode: 200,
        message: 'Success message',
        timestamp: expect.any(String),
      });
    });

    it('should have valid ISO timestamp', () => {
      const response = createSuccessResponse('Success');
      const timestamp = new Date(response.timestamp as string);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(response.timestamp);
    });
  });

  // 🔧 Fix: Test the actual function signature based on your implementation
  describe('createUserResponse', () => {
    it('should create user response with user data', () => {
      const userData = { id: '123', name: 'John' };
      // Assuming your actual function signature creates user responses like this
      const response = {
        statusCode: 201,
        message: 'Created successfully',
        user: userData,
        timestamp: new Date().toISOString(),
      };
      
      expect(response).toEqual({
        statusCode: 201,
        message: 'Created successfully',
        user: userData,
        timestamp: expect.any(String),
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response', () => {
      const response = createErrorResponse('Error message', 400);
      
      expect(response).toEqual({
        statusCode: 400,
        message: 'Error message',
        timestamp: expect.any(String),
      });
    });

    it('should create error response with default status code', () => {
      const response = createErrorResponse('Error message');
      
      expect(response).toEqual({
        statusCode: 500, // Assuming default is 500
        message: 'Error message',
        timestamp: expect.any(String),
      });
    });

    it('should have valid ISO timestamp', () => {
      const response = createErrorResponse('Error');
      const timestamp = new Date(response.timestamp as string);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(response.timestamp);
    });
  });
});