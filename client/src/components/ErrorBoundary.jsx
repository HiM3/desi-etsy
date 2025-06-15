import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
          <div className="w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">Something went wrong</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#d35400] text-white py-2 px-4 rounded-md hover:bg-[#b34700] transition-colors duration-300 text-sm sm:text-base"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 