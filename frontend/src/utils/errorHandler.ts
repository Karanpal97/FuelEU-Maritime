/**
 * Error Handler Utility
 * Extracts meaningful error messages from various error types
 */
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: string;
  type: 'network' | 'server' | 'client' | 'unknown';
}

/**
 * Convert technical error messages to user-friendly ones
 */
function makeUserFriendly(message: string): string {
  const msg = message.toLowerCase();
  
  // Year mismatch
  if (msg.includes('year') && msg.includes('does not match')) {
    return 'Selected route and year do not match';
  }
  
  // Route not found
  if (msg.includes('route') && (msg.includes('not found') || msg.includes('does not exist'))) {
    return 'Route not found';
  }
  
  // Insufficient balance
  if (msg.includes('insufficient') || msg.includes('not enough surplus')) {
    return 'Insufficient balance for this operation';
  }
  
  // No surplus
  if (msg.includes('no surplus') || msg.includes('deficit')) {
    return 'No surplus balance available';
  }
  
  // Pool errors
  if (msg.includes('pool') && msg.includes('invalid')) {
    return 'Invalid pool configuration';
  }
  
  // Ship/route already exists
  if (msg.includes('already') && (msg.includes('exists') || msg.includes('in pool'))) {
    return 'This item already exists';
  }
  
  // Validation errors
  if (msg.includes('validation') || msg.includes('invalid')) {
    return 'Invalid input data';
  }
  
  // Database errors
  if (msg.includes('database') || msg.includes('connection')) {
    return 'Database connection issue';
  }
  
  // Return original if no pattern matches, but capitalize first letter
  return message.charAt(0).toUpperCase() + message.slice(1);
}

export function extractErrorMessage(error: unknown): ApiError {
  // Handle Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ error?: string; message?: string; success?: boolean }>;
    
    // Network error (no response)
    if (!axiosError.response) {
      return {
        message: 'Cannot Connect to Server',
        details: 'Please check your internet connection or try again later.',
        type: 'network',
      };
    }

    const { status, data } = axiosError.response;
    const statusCode = status;

    // Extract error message from response
    let errorMessage = data?.error || data?.message || axiosError.message;
    
    // Make error messages more user-friendly
    errorMessage = makeUserFriendly(errorMessage);

    // Handle different status codes with user-friendly messages
    switch (statusCode) {
      case 400:
        return {
          message: errorMessage || 'Invalid Input',
          details: 'Please check your selections and try again.',
          statusCode,
          type: 'client',
        };
      
      case 404:
        return {
          message: errorMessage || 'Not Found',
          details: 'The requested item could not be found. Try selecting a different option.',
          statusCode,
          type: 'client',
        };
      
      case 500:
        return {
          message: errorMessage || 'Something Went Wrong',
          details: 'An error occurred. Please try again or contact support if the issue persists.',
          statusCode,
          type: 'server',
        };
      
      case 503:
        return {
          message: 'Service Temporarily Unavailable',
          details: 'Please try again in a few moments.',
          statusCode,
          type: 'server',
        };
      
      default:
        return {
          message: errorMessage || 'An Error Occurred',
          details: 'Please try again or contact support.',
          statusCode,
          type: statusCode >= 500 ? 'server' : 'client',
        };
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      details: 'An unexpected error occurred.',
      type: 'unknown',
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'unknown',
    };
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    details: 'Please try again or contact support if the problem persists.',
    type: 'unknown',
  };
}

export function getErrorSuggestion(error: ApiError): string[] {
  const suggestions: string[] = [];
  const errorMessage = error.message.toLowerCase();

  // Check for specific error patterns and provide user-friendly suggestions
  
  // Year mismatch errors
  if (errorMessage.includes('year') && (errorMessage.includes('does not match') || errorMessage.includes('mismatch'))) {
    suggestions.push('The selected route belongs to a different year');
    suggestions.push('Try selecting a route from the same year using the filters');
    suggestions.push('Or change the year dropdown to match the route\'s year');
    return suggestions;
  }

  // Route not found errors
  if (errorMessage.includes('route') && (errorMessage.includes('not found') || errorMessage.includes('does not exist'))) {
    suggestions.push('This route ID may not exist in the system');
    suggestions.push('Try selecting a different route from the dropdown');
    suggestions.push('Check the Routes tab to see available routes');
    return suggestions;
  }

  // Insufficient balance/surplus errors
  if (errorMessage.includes('insufficient') || errorMessage.includes('not enough') || errorMessage.includes('surplus')) {
    suggestions.push('You don\'t have enough balance for this operation');
    suggestions.push('Check your available balance in the KPI cards above');
    suggestions.push('Try entering a smaller amount');
    return suggestions;
  }

  // Deficit/negative balance errors
  if (errorMessage.includes('deficit') || errorMessage.includes('negative')) {
    suggestions.push('Cannot perform this operation with a deficit balance');
    suggestions.push('Select a route with surplus (positive) balance');
    suggestions.push('Or try the "Apply Banked" option to use previously saved surplus');
    return suggestions;
  }

  // Pool validation errors
  if (errorMessage.includes('pool') && (errorMessage.includes('invalid') || errorMessage.includes('sum'))) {
    suggestions.push('The pool configuration is invalid');
    suggestions.push('Make sure the total pool balance is positive');
    suggestions.push('Add more ships with surplus or remove ships with large deficits');
    return suggestions;
  }

  // Generic suggestions based on error type
  switch (error.type) {
    case 'network':
      suggestions.push('Cannot connect to the server');
      suggestions.push('Please check your internet connection');
      suggestions.push('If the problem persists, contact support');
      break;
    
    case 'server':
      if (error.statusCode === 500) {
        suggestions.push('Something went wrong on the server');
        suggestions.push('Please try again in a moment');
        suggestions.push('If the error continues, contact support');
      }
      break;
    
    case 'client':
      if (error.statusCode === 404) {
        suggestions.push('The requested data was not found');
        suggestions.push('Try selecting different filters or options');
        suggestions.push('Check the available options in the dropdowns');
      } else if (error.statusCode === 400) {
        suggestions.push('Please check your input values');
        suggestions.push('Make sure all required fields are filled');
        suggestions.push('Verify that numeric fields contain valid numbers');
      }
      break;
  }

  // If no specific suggestions, provide a generic one
  if (suggestions.length === 0) {
    suggestions.push('Please try a different selection');
    suggestions.push('Contact support if the problem persists');
  }

  return suggestions;
}

