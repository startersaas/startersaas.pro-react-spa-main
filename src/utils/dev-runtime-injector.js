// utils/dev-runtime-injector.js
/**
 * Development Mode Runtime Comment Processor
 * 
 * This module injects capabilities for handling server comment markers
 * during development with the CRA dev server.
 * 
 * Enhanced to support multiline code blocks with @eserver-begin and @eserver-end
 */

// Self-executing function to setup the runtime
(function setupServerMarkerProcessor() {
  if (process.env.NODE_ENV !== 'development') {
    // Only run in development mode
    return;
  }
  
  // Make sure we only run this once
  if (window.__SERVER_MARKER_PROCESSOR_READY) {
    return;
  }
  
  window.__SERVER_MARKER_PROCESSOR_READY = true;
  window.__markerCodeRegistry = new Map();
  window.__markerLogs = window.__markerLogs || [];

  // Add log to visual log store
  function addLog(level, message, data = null) {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      id: `${Date.now()}_${Math.random().toString().slice(2, 8)}`,
      timestamp,
      level,
      message: `[Server Markers] ${message}`,
      data: data !== null ? data : undefined
    };
    
    // Add to our logs array for visual display
    if (window.__markerLogs) {
      window.__markerLogs.push(logEntry);
      if (window.__markerLogs.length > 1000) {
        window.__markerLogs = window.__markerLogs.slice(-1000);
      }
    }
    
    // Add to global logs array if available
    if (window.globalLogs) {
      window.globalLogs.push(logEntry);
      if (window.globalLogs.length > 1000) {
        window.globalLogs = window.globalLogs.slice(-1000);
      }
    }
    
    return logEntry;
  }

  addLog('info', 'Setting up development runtime processor');
  
  // Process script source to find markers
  function processScriptSource(scriptElement) {
    if (!scriptElement.src || 
        scriptElement.src.includes('node_modules') || 
        scriptElement.src.includes('chunk') ||
        scriptElement.__processed) {
      return;
    }
    
    scriptElement.__processed = true;
    
    fetch(scriptElement.src)
      .then(response => response.text())
      .then(content => {
        const lines = content.split('\n');
        
        // Process single-line markers (existing functionality)
        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].includes('@eserver-register-next-line')) {
            const nextLine = lines[i + 1].trim();
            const id = `${scriptElement.src.replace(/[^\w]/g, '_')}_${i}`;
            
            window.__markerCodeRegistry.set(id, {
              src: scriptElement.src,
              line: i + 1,
              code: nextLine
            });
            
            addLog('info', `Found single-line marker at ${scriptElement.src}:${i+1}`);
          }
        }
        
        // Process multiline markers (new functionality)
        let inMultilineBlock = false;
        let blockStartLine = -1;
        let blockCode = [];
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('@eserver-begin')) {
            if (inMultilineBlock) {
              addLog('warn', `Nested @eserver-begin found at ${scriptElement.src}:${i+1}. Previous block will be closed.`);
            }
            inMultilineBlock = true;
            blockStartLine = i;
            blockCode = [];
            continue;
          }
          
          if (inMultilineBlock) {
            if (lines[i].includes('@eserver-end')) {
              inMultilineBlock = false;
              
              // Register the multiline block
              const id = `${scriptElement.src.replace(/[^\w]/g, '_')}_block_${blockStartLine}`;
              const codeBlock = blockCode.join('\n');
              
              window.__markerCodeRegistry.set(id, {
                src: scriptElement.src,
                line: blockStartLine,
                isBlock: true,
                code: codeBlock
              });
              
              addLog('info', `Found multiline block at ${scriptElement.src}:${blockStartLine}-${i} (${blockCode.length} lines)`);
            } else {
              // Add to the current block
              blockCode.push(lines[i]);
            }
          }
        }
        
        // Check if we ended with an unclosed block
        if (inMultilineBlock) {
          addLog('warn', `Unclosed multiline block starting at ${scriptElement.src}:${blockStartLine}`);
        }
      })
      .catch(err => {
        addLog('error', `Error fetching script: ${scriptElement.src}`);
      });
  }
  
  // Scan the DOM for scripts
  function scanDOM() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(processScriptSource);
  }
  
  // Add mutation observer to catch dynamically added scripts
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'SCRIPT') {
            processScriptSource(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('script[src]').forEach(processScriptSource);
          }
        });
      }
    });
  });
  
  // Setup source map checking
  function processSourceMaps() {
    document.querySelectorAll('script[src]').forEach(script => {
      if (script.__mapProcessed || !script.src) return;
      script.__mapProcessed = true;
      
      fetch(script.src)
        .then(response => response.text())
        .then(content => {
          const sourceMapMatch = content.match(/\/\/# sourceMappingURL=([^\s]+)/);
          if (sourceMapMatch) {
            const mapUrl = new URL(sourceMapMatch[1], script.src).href;
            
            fetch(mapUrl)
              .then(response => response.json())
              .then(sourceMap => {
                if (sourceMap.sources && sourceMap.sourcesContent) {
                  sourceMap.sources.forEach((source, index) => {
                    if (sourceMap.sourcesContent[index] && !source.includes('node_modules')) {
                      const content = sourceMap.sourcesContent[index];
                      const lines = content.split('\n');
                      
                      // Process single-line markers in source maps
                      for (let i = 0; i < lines.length - 1; i++) {
                        if (lines[i].includes('@eserver-register-next-line')) {
                          const nextLine = lines[i + 1].trim();
                          const id = `${source.replace(/[^\w]/g, '_')}_${i}`;
                          
                          window.__markerCodeRegistry.set(id, {
                            src: source,
                            line: i + 1,
                            code: nextLine
                          });
                          
                          addLog('info', `Found single-line marker in source map: ${source}:${i+1}`);
                        }
                      }
                      
                      // Process multiline markers in source maps
                      let inMultilineBlock = false;
                      let blockStartLine = -1;
                      let blockCode = [];
                      
                      for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes('@eserver-begin')) {
                          if (inMultilineBlock) {
                            addLog('warn', `Nested @eserver-begin found in source map at ${source}:${i+1}`);
                          }
                          inMultilineBlock = true;
                          blockStartLine = i;
                          blockCode = [];
                          continue;
                        }
                        
                        if (inMultilineBlock) {
                          if (lines[i].includes('@eserver-end')) {
                            inMultilineBlock = false;
                            
                            // Register the multiline block
                            const id = `${source.replace(/[^\w]/g, '_')}_block_${blockStartLine}`;
                            const codeBlock = blockCode.join('\n');
                            
                            window.__markerCodeRegistry.set(id, {
                              src: source,
                              line: blockStartLine,
                              isBlock: true,
                              code: codeBlock
                            });
                            
                            addLog('info', `Found multiline block in source map: ${source}:${blockStartLine}-${i} (${blockCode.length} lines)`);
                          } else {
                            // Add to the current block
                            blockCode.push(lines[i]);
                          }
                        }
                      }
                    }
                  });
                }
              })
              .catch(err => {
                addLog('error', `Error processing source map: ${mapUrl}`);
              });
          }
        })
        .catch(err => {
          addLog('error', `Error fetching script for source map: ${script.src}`);
        });
    });
  }
  
  // Process existing scripts when loaded
  function initialize() {
    scanDOM();
    observer.observe(document, { childList: true, subtree: true });
    
    // Check for source maps after initial load
    setTimeout(processSourceMaps, 1000);
  }
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Expose direct function to execute a line of code
  window.__executeMarkerCode = async function(code, args = []) {
    if (!window.globalConnection) {
      throw new Error('No WebSocket connection available');
    }
    
    const functionId = `direct_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    addLog('info', `Executing marker code: ${code.substring(0, 50)}${code.length > 50 ? '...' : ''}`);
    
    // Register the code
    await new Promise((resolve, reject) => {
      const requestId = `reg_${Date.now()}`;
      
      const handler = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.requestId === requestId) {
            window.globalConnection.socket.removeEventListener('message', handler);
            
            if (data.error) {
              addLog('error', `Registration error: ${data.error}`);
              reject(new Error(data.error));
            } else {
              addLog('info', `Code registered successfully with ID: ${functionId}`);
              resolve(data.result);
            }
          }
        } catch (error) {
          // Ignore parse errors
        }
      };
      
      window.globalConnection.socket.addEventListener('message', handler);
      
      window.globalConnection.socket.send(JSON.stringify({
        type: 'register',
        requestId,
        functionId,
        functionBody: code,
        paramNames: []
      }));
      
      // Timeout for safety
      setTimeout(() => {
        window.globalConnection.socket.removeEventListener('message', handler);
        addLog('error', 'Registration timed out');
        reject(new Error('Registration timed out'));
      }, 5000);
    });
    
    // Execute the code
    return new Promise((resolve, reject) => {
      const requestId = `exec_${Date.now()}`;
      
      addLog('info', `Executing registered code: ${functionId}`);
      
      const handler = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.requestId === requestId) {
            window.globalConnection.socket.removeEventListener('message', handler);
            
            if (data.error) {
              addLog('error', `Execution error: ${data.error}`);
              reject(new Error(data.error));
            } else {
              addLog('info', `Code executed successfully: ${functionId}`);
              resolve(data.result);
            }
          }
        } catch (error) {
          // Ignore parse errors
        }
      };
      
      window.globalConnection.socket.addEventListener('message', handler);
      
      window.globalConnection.socket.send(JSON.stringify({
        type: 'execute',
        requestId,
        functionId,
        args: args || []
      }));
      
      // Timeout for safety
      setTimeout(() => {
        window.globalConnection.socket.removeEventListener('message', handler);
        addLog('error', 'Execution timed out');
        reject(new Error('Execution timed out'));
      }, 10000);
    });
  };
  
  addLog('info', 'Development runtime processor ready');
})();

// Export a function to trigger initialization
export function initDevServerMarkers() {
  // This is just a marker function to ensure the IIFE above is executed
  return true;
}

// Export the logs for the UI components
export function getMarkerLogs() {
  return window.__markerLogs || [];
}