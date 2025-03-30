// ./server-marker-loader.js
/**
 * Server Marker Webpack Loader for React App Rewired
 * 
 * This loader identifies server code markers and processes them
 * to prevent client-side execution of server code.
 * 
 * Supports:
 * - @eserver-register-next-line for single line markers
 * - @eserver-begin and @eserver-end for multiline blocks
 * 
 * Automatically wraps code in IIFEs for proper execution.
 */

module.exports = function(source) {
  // Skip if not a JavaScript file
  if (!this.resourcePath.match(/\.(js|jsx|ts|tsx)$/)) {
    return source;
  }
  
  const lines = source.split('\n');
  let modified = false;
  
  // Process single-line markers
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    
    // Find our marker comment
    if (line.includes('@eserver-register-next-line')) {
      const nextLine = lines[i + 1];
      const id = `${this.resourcePath.replace(/[^\w]/g, '_')}_${i}`;
      
      // Replace the next line with code that registers it for server execution
      lines[i + 1] = `
        // Original server code: ${nextLine.trim()}
        (function() {
          if (typeof window !== 'undefined') {
            if (!window.__serverMarkers) window.__serverMarkers = {};
            window.__serverMarkers["${id}"] = ${JSON.stringify(nextLine.trim())};
          }
        })();
      `;
      
      modified = true;
    }
  }
  
  // Process multiline blocks
  let inBlock = false;
  let blockStartLine = -1;
  let blockLines = [];
  let processedSource = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('@eserver-begin')) {
      // Start of a new block
      inBlock = true;
      blockStartLine = i;
      blockLines = [];
      processedSource.push(line); // Keep the begin marker comment
    } 
    else if (inBlock && line.includes('@eserver-end')) {
      // End of the current block
      inBlock = false;
      const id = `${this.resourcePath.replace(/[^\w]/g, '_')}_block_${blockStartLine}`;
      
      // Get the block content
      const blockContent = blockLines.join('\n');
      
      // Generate a unique function name with ID
      const uniqueFuncName = `serverFunc_${blockStartLine}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Automatically wrap in async function with unique name
      const wrappedContent = `
  async function ${uniqueFuncName}() {
${blockContent}
  }
  return ${uniqueFuncName}();`;
      
      // Create the registration code to replace the block
      processedSource.push(`
        // Original server code block: ${blockLines.length} lines
        (function() {
          if (typeof window !== 'undefined') {
            if (!window.__serverMarkers) window.__serverMarkers = {};
            window.__serverMarkers["${id}"] = ${JSON.stringify(`(async function() {${wrappedContent}})();`)};
          }
        })();
      `);
      
      processedSource.push(line); // Keep the end marker comment
      modified = true;
    }
    else if (inBlock) {
      // Inside a block - collect lines but don't add them to the output yet
      blockLines.push(line);
    }
    else {
      // Normal line (not in a block)
      processedSource.push(line);
    }
  }
  
  // If we found any multiline blocks, use the processed source
  if (inBlock || processedSource.length > 0) {
    // Warning if we ended with an unclosed block
    if (inBlock) {
      console.warn(`[server-marker-loader] Unclosed @eserver-begin block at ${this.resourcePath}:${blockStartLine}`);
    }
    
    // Only use the processed source if we actually processed multiline blocks
    if (processedSource.length > 0) {
      return processedSource.join('\n');
    }
  }
  
  // If we only modified single-line markers, return the modified lines
  if (modified) {
    return lines.join('\n');
  }
  
  // Otherwise, return the original source unchanged
  return source;
};