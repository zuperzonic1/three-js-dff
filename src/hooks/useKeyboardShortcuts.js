import { useEffect } from 'react';

const useKeyboardShortcuts = ({ 
    onCameraReset, 
    onAnimationToggle, 
    onWireframeToggle, 
    onStatsToggle,
    onResetViewer 
}) => {
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Ignore if user is typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                return;
            }

            switch (event.key.toLowerCase()) {
                case 'r':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        onCameraReset?.();
                    } else {
                        onResetViewer?.();
                    }
                    break;
                case ' ':
                    event.preventDefault();
                    onAnimationToggle?.();
                    break;
                case 'w':
                    onWireframeToggle?.();
                    break;
                case 's':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        // Save functionality could be added here
                    } else {
                        onStatsToggle?.();
                    }
                    break;
                case '?':
                case 'h':
                    // Show help modal (could be implemented later)
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onCameraReset, onAnimationToggle, onWireframeToggle, onStatsToggle, onResetViewer]);
};

export default useKeyboardShortcuts;
