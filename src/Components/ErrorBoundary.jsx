import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center space-y-6 max-w-md mx-auto p-6">
                        <div className="relative">
                            <div className="w-32 h-32 mx-auto border-4 border-red-500/20 rounded-full flex items-center justify-center">
                                <div className="w-20 h-20 border-4 border-red-500/40 rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">💥</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-white">
                                Something went wrong
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                An unexpected error occurred while rendering the 3D viewer.
                            </p>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-lg p-4 text-left">
                            <h4 className="text-sm font-semibold text-white mb-2">Error Details:</h4>
                            <div className="text-xs text-red-400 font-mono bg-slate-900/50 p-2 rounded overflow-auto max-h-32">
                                {this.state.error && this.state.error.toString()}
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-4 text-xs">
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                Reload Page
                            </button>
                            <button 
                                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
