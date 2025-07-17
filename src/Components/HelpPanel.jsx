import { useState } from 'react';

const HelpPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all z-40 flex items-center justify-center"
                title="Help & Guide"
            >
                ?
            </button>

            {/* Help Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-slate-800 rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Help & Guide</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Custom Scrollable Content */}
                        <div className="max-h-[75vh] sm:max-h-[60vh] overflow-y-auto pr-2 sm:pr-4 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full hover:scrollbar-thumb-purple-400"
                             style={{
                                 scrollbarWidth: 'thin',
                                 scrollbarColor: '#8b5cf6 #374151'
                             }}
                        >
                            {/* Getting Started */}
                            <section>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3">Getting Started</h3>
                                <div className="space-y-2 text-slate-300">
                                    <p>1. Upload or select a .dff model file</p>
                                    <p>2. Upload or select a .txd texture file</p>
                                    <p>3. Click &quot;Load Model&quot; to render</p>
                                    <p>4. Use mouse to orbit around the model</p>
                                </div>
                            </section>

                            {/* Mouse Controls */}
                            <section>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3">Mouse Controls</h3>
                                <div className="space-y-2 text-slate-300 text-sm">
                                    <div className="flex justify-between">
                                        <span>Left click + drag</span>
                                        <span className="text-slate-400">Rotate camera</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Right click + drag</span>
                                        <span className="text-slate-400">Pan camera</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Scroll wheel</span>
                                        <span className="text-slate-400">Zoom in/out</span>
                                    </div>
                                </div>
                            </section>

                            {/* File Formats */}
                            <section>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3">Supported Formats</h3>
                                <div className="space-y-2 text-slate-300 text-sm">
                                    <div><strong>DFF:</strong> RenderWare geometry files from GTA San Andreas</div>
                                    <div><strong>TXD:</strong> RenderWare texture dictionary files</div>
                                </div>
                            </section>

                            {/* Features */}
                            <section>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3">Features</h3>
                                <div className="grid grid-cols-2 gap-2 text-slate-300 text-sm">
                                    <div>• Drag & drop file upload</div>
                                    <div>• Real-time 3D rendering</div>
                                    <div>• Wireframe mode</div>
                                    <div>• Auto-rotation animation</div>
                                    <div>• Performance statistics</div>
                                    <div>• Camera controls</div>
                                    <div>• Built-in model library</div>
                                    <div>• Responsive design</div>
                                </div>
                            </section>

                            {/* Control Panel */}
                            <section>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3">Control Panel</h3>
                                <div className="space-y-2 text-slate-300 text-sm">
                                    <div className="flex justify-between">
                                        <span>🎯 Reset View</span>
                                        <span className="text-slate-400">Reset camera position</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>▶️ Rotate</span>
                                        <span className="text-slate-400">Toggle model animation</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>📐 Wireframe</span>
                                        <span className="text-slate-400">Toggle wireframe mode</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>📊 Stats</span>
                                        <span className="text-slate-400">Show performance stats</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-600 space-y-2 sm:space-y-3">
                            <p className="text-center text-slate-400 text-xs sm:text-sm">
                                Built with React Three Fiber and Three.js
                            </p>
                            <div className="text-center text-slate-500 text-xs">
                                DFF/TXD parsing powered by{' '}
                                <a 
                                    href="https://github.com/Timic3/rw-parser" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 underline transition-colors"
                                >
                                    rw-parser
                                </a>
                                {' '}by Timic3
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpPanel;
