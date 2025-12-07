import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileUploadZone = ({ title, accept, files, onFilesAdded, onRemoveFile, color = 'purple' }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const colorClasses = {
        purple: {
            border: isDragOver ? 'border-purple-400 border-2 bg-purple-500/20 shadow-xl shadow-purple-500/30 scale-[1.02] ring-2 ring-purple-500/50' : 'border-purple-500/20 hover:border-purple-500/40',
            dot: 'bg-purple-400',
            file: 'file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30',
            success: 'text-green-400',
            error: 'text-red-400'
        },
        pink: {
            border: isDragOver ? 'border-pink-400 border-2 bg-pink-500/20 shadow-xl shadow-pink-500/30 scale-[1.02] ring-2 ring-pink-500/50' : 'border-purple-500/20 hover:border-pink-500/40',
            dot: 'bg-pink-400',
            file: 'file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30',
            success: 'text-green-400',
            error: 'text-red-400'
        }
    };

    const classes = colorClasses[color];

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file => {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            return accept.includes(extension);
        });

        if (validFiles.length > 0) {
            onFilesAdded(validFiles);
        } else {
            alert(`Please drop ${accept} files only`);
        }
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            onFilesAdded(selectedFiles);
        }
        // Clear input to allow re-selecting same files
        e.target.value = '';
    };

    const getFileStatusIcon = (file) => {
        if (file.parsed === true) {
            return <div className={`w-1.5 h-1.5 rounded-full ${classes.success}`}></div>;
        } else if (file.parsed === false) {
            return <div className={`w-1.5 h-1.5 rounded-full ${classes.error}`}></div>;
        } else {
            return <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>;
        }
    };

    const getFileStatusText = (file) => {
        if (file.parsed === true) {
            return 'Parsed successfully';
        } else if (file.parsed === false) {
            return `Error: ${file.error}`;
        } else {
            return 'Ready to parse';
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                className={`bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 relative ${classes.border}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnter={handleDragOver}
            >
                <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${classes.dot}`}></div>
                    <h3 className="text-white font-semibold">{title}</h3>
                    <span className="text-slate-400 text-sm">({files.length} files)</span>
                </div>

                <div className="text-center space-y-4">
                    <div className="space-y-2">
                        <svg className="w-12 h-12 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-white font-medium">
                            Drop {accept} files here
                        </div>
                        <div className="text-slate-400 text-sm">
                            or click to browse
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        multiple
                        onChange={handleFileInput}
                        className={`w-full text-sm text-slate-300 
                                 file:mr-4 file:py-2 file:px-4 
                                 file:rounded-lg file:border-0 
                                 file:text-sm file:font-medium 
                                 ${classes.file}
                                 file:cursor-pointer cursor-pointer
                                 border border-slate-600 rounded-lg bg-slate-800/50`}
                    />
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm">Selected Files:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {files.map((file) => (
                            <div key={file.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        {getFileStatusIcon(file)}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-slate-300 font-medium truncate">
                                                {file.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {(file.size / 1024).toFixed(1)} KB • {getFileStatusText(file)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => onRemoveFile(file.id)}
                                        className="ml-2 p-1 hover:bg-red-500/20 rounded transition-colors"
                                        title="Remove file"
                                    >
                                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

FileUploadZone.propTypes = {
    title: PropTypes.string.isRequired,
    accept: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    onFilesAdded: PropTypes.func.isRequired,
    onRemoveFile: PropTypes.func.isRequired,
    color: PropTypes.oneOf(['purple', 'pink'])
};

export default FileUploadZone;
