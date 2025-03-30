// utils/use-server.js
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Button, 
  TableContainer, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@mui/material';

// Contexts
const ServerContext = createContext(null);
const LogContext = createContext(null);

// Global state
let globalLogs = [];
let globalConnection = null;

/**
 * Visual logging function
 */
function addLog(level, message, data = null) {
  const entry = {
    id: Date.now() + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    level,
    message,
    data
  };
  
  globalLogs.push(entry);
  if (globalLogs.length > 1000) {
    globalLogs = globalLogs.slice(-1000);
  }
  
  return entry;
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.addServerLog = addLog;
}

/**
 * WebSocket connection manager
 */
class ServerConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.socket = null;
    this.connected = false;
    this.connecting = false;
    this.pendingRequests = new Map();
    this.markerResults = new Map();
    this.connect();
  }
  
  connect() {
    if (this.connecting) return;
    this.connecting = true;
    
    addLog('info', `Connecting to server at ${this.wsUrl}`);
    
    this.socket = new WebSocket(this.wsUrl);
    
    this.socket.onopen = () => {
      this.connected = true;
      this.connecting = false;
      addLog('info', 'Connected to server');
      
      // Process any existing markers
      this.processExistingMarkers();
    };
    
    this.socket.onclose = () => {
      this.connected = false;
      this.connecting = false;
      addLog('warn', 'Connection closed, reconnecting in 3s');
      setTimeout(() => this.connect(), 3000);
    };
    
    this.socket.onerror = () => {
      this.connecting = false;
      addLog('error', 'Connection error');
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle responses to our requests
        if (data.requestId && this.pendingRequests.has(data.requestId)) {
          const { resolve, reject } = this.pendingRequests.get(data.requestId);
          this.pendingRequests.delete(data.requestId);
          
          if (data.error) {
            addLog('error', `Server error: ${data.error}`);
            reject(new Error(data.error));
          } else {
            addLog('debug', 'Received response from server');
            
            // Store results for markers
            if (data.markerId) {
              this.markerResults.set(data.markerId, data.result);
              window.__serverResults[data.markerId] = data.result;
            }
            
            resolve(data.result);
          }
        }
      } catch (err) {
        addLog('error', 'Error parsing message');
      }
    };
  }
  
  /**
   * Process any markers found at load time
   */
  processExistingMarkers() {
    if (window.__markerCodeRegistry) {
      const markerCount = window.__markerCodeRegistry.size;
      
      if (markerCount > 0) {
        addLog('info', `Processing ${markerCount} server markers`);
        
        for (const [id, info] of window.__markerCodeRegistry.entries()) {
          // Store in the legacy format for backward compatibility
          if (!window.__serverMarkers) {
            window.__serverMarkers = {};
          }
          window.__serverMarkers[id] = info.code;
          
          // Register the code with the server
          this.registerServerCode(id, info.code);
        }
      }
    } else if (window.__serverMarkers) {
      // Legacy marker format
      const markerCount = Object.keys(window.__serverMarkers).length;
      
      if (markerCount > 0) {
        addLog('info', `Processing ${markerCount} legacy server markers`);
        
        Object.entries(window.__serverMarkers).forEach(([id, code]) => {
          this.registerServerCode(id, code);
        });
      }
    }
  }
  
  /**
   * Register server code
   */
  registerServerCode(markerId, code) {
    if (!this.connected) {
      addLog('warn', 'Cannot register code - not connected');
      return Promise.reject(new Error('Not connected'));
    }
    
    addLog('info', `Registering server code: ${markerId}`);
    
    return new Promise((resolve, reject) => {
      const requestId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      this.pendingRequests.set(requestId, { resolve, reject });
      
      this.socket.send(JSON.stringify({
        type: 'register',
        requestId,
        functionId: markerId,
        functionBody: code
      }));
      
      // Safety timeout
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Registration timed out'));
        }
      }, 5000);
    });
  }
  
  /**
   * Execute server code
   */
  executeServerCode(markerId, args = []) {
    if (!this.connected) {
      addLog('warn', 'Cannot execute - not connected');
      return Promise.reject(new Error('Not connected'));
    }
    
    addLog('info', `Executing server code: ${markerId}`);
    
    return new Promise((resolve, reject) => {
      const requestId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      this.pendingRequests.set(requestId, { resolve, reject });
      
      this.socket.send(JSON.stringify({
        type: 'execute',
        requestId,
        markerId,
        functionId: markerId,
        args
      }));
      
      // Safety timeout
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Execution timed out'));
        }
      }, 10000);
    });
  }
}

/**
 * Find all server markers in code and register them
 */
function setupMarkerSystem() {
  // Make globals available
  window.__serverMarkers = window.__serverMarkers || {};
  window.__serverResults = window.__serverResults || {};
  
  // Utility to execute a server marker
  window.__executeServerMarker = async function(markerId, args = []) {
    if (!globalConnection || !globalConnection.connected) {
      addLog('error', 'Cannot execute marker - no connection');
      return null;
    }
    
    try {
      const result = await globalConnection.executeServerCode(markerId, args);
      return result;
    } catch (err) {
      addLog('error', `Error executing marker: ${err.message}`);
      return null;
    }
  };
  
  // Utility to execute a multiline block
  window.__executeServerBlock = async function(blockId, args = []) {
    if (!globalConnection || !globalConnection.connected) {
      addLog('error', 'Cannot execute block - no connection');
      return null;
    }
    
    if (!window.__markerCodeRegistry || !window.__markerCodeRegistry.has(blockId)) {
      addLog('error', `Block not found: ${blockId}`);
      return null;
    }
    
    try {
      const result = await globalConnection.executeServerCode(blockId, args);
      return result;
    } catch (err) {
      addLog('error', `Error executing block: ${err.message}`);
      return null;
    }
  };
  
  // Helper to find a block by source file and content pattern
  window.__findServerBlock = function(sourcePattern, contentPattern) {
    if (!window.__markerCodeRegistry) {
      return null;
    }
    
    for (const [id, info] of window.__markerCodeRegistry.entries()) {
      if (info.isBlock && 
          info.src.includes(sourcePattern) && 
          info.code.includes(contentPattern)) {
        return id;
      }
    }
    
    return null;
  };
}

/**
 * Provider component
 */
export function ServerFunctionProvider({ children, wsUrl }) {
  const [connection, setConnection] = useState(null);
  const [logs, setLogs] = useState([]);
  
  // Setup connection
  useEffect(() => {
    // Default WebSocket URL
    const defaultUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:8080/ws`;
    const finalUrl = wsUrl || defaultUrl;
    
    // Create connection
    const conn = new ServerConnection(finalUrl);
    globalConnection = conn;
    window.globalConnection = conn;
    setConnection(conn);
    
    // Setup marker system
    setupMarkerSystem();
    
    // Update logs periodically
    const interval = setInterval(() => {
      setLogs([...globalLogs]);
    }, 1000);
    
    return () => {
      clearInterval(interval);
      if (conn.socket) {
        conn.socket.close();
      }
    };
  }, [wsUrl]);
  
  const logContext = useMemo(() => ({
    logs,
    addLog: (level, msg, data) => {
      addLog(level, msg, data);
      setLogs([...globalLogs]);
    },
    clearLogs: () => {
      globalLogs = [];
      setLogs([]);
    }
  }), [logs]);
  
  return (
    <LogContext.Provider value={logContext}>
      <ServerContext.Provider value={connection}>
        {children}
      </ServerContext.Provider>
    </LogContext.Provider>
  );
}

/**
 * Create a server function 
 */
export function createServerFunction(func) {
  if (!globalConnection) {
    return () => Promise.reject(new Error('No server connection'));
  }
  
  // Handle direct code strings
  if (typeof func === 'string') {
    const id = `direct_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Register the code
    globalConnection.registerServerCode(id, func);
    
    // Return function to execute it
    return (...args) => globalConnection.executeServerCode(id, args);
  }
  
  // Handle function objects
  const id = `fn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const body = func.toString().match(/\{([\s\S]*)\}/)?.[1].trim() || 'return null;';
  
  // Register the function
  globalConnection.registerServerCode(id, body);
  
  // Return function to execute it
  return (...args) => globalConnection.executeServerCode(id, args);
}

/**
 * Execute a multiline server block by searching for it
 */
export function executeServerBlock(sourcePattern, contentPattern, args = []) {
  if (!window.__findServerBlock || !window.__executeServerBlock) {
    return Promise.reject(new Error('Server block functionality not available'));
  }
  
  const blockId = window.__findServerBlock(sourcePattern, contentPattern);
  
  if (!blockId) {
    return Promise.reject(new Error(`No matching server block found matching: ${sourcePattern}, ${contentPattern}`));
  }
  
  return window.__executeServerBlock(blockId, args);
}

/**
 * Hook to access server connection
 */
export function useServerConnection() {
  return useContext(ServerContext);
}

/**
 * Hook to access logs
 */
export function useServerLogs() {
  return useContext(LogContext);
}

/**
 * Hook to work with server blocks
 */
export function useServerBlock(sourcePattern, contentPattern) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const execute = useCallback(async (args = []) => {
    setLoading(true);
    setError(null);
    
    try {
      const blockResult = await executeServerBlock(sourcePattern, contentPattern, args);
      setResult(blockResult);
      return blockResult;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sourcePattern, contentPattern]);
  
  return {
    execute,
    loading,
    error,
    result
  };
}

/**
 * Log viewer component
 */
export function LogViewer({ 
  maxHeight = '300px', 
  showTimestamp = true,
  showLevel = true,
  showData = true,
  maxItems = 100
}) {
  const { logs, clearLogs } = useContext(LogContext);
  const [filter, setFilter] = useState('');
  
  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => !filter || log.level === filter || log.message.includes(filter))
      .slice(-maxItems);
  }, [logs, filter, maxItems]);
  
  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Server Function Logs
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            displayEmpty
            sx={{ 
              fontSize: '0.75rem',
              height: 28,
              '& .MuiSelect-select': {
                py: 0.5,
                px: 1
              }
            }}
          >
            <MenuItem value="">All Levels</MenuItem>
            <MenuItem value="debug">Debug</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warn">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
          <Button
            onClick={clearLogs}
            size="small"
            variant="contained"
            color="error"
            sx={{ 
              py: 0, 
              px: 1.5, 
              minWidth: 'auto',
              fontSize: '0.75rem'
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
      
      <Box
        sx={{ 
          overflowY: 'auto', 
          maxHeight, 
          fontFamily: 'monospace', 
          fontSize: '0.75rem'
        }}
      >
        {filteredLogs.length === 0 ? (
          <Box sx={{ p: 2, color: 'text.secondary' }}>
            No logs to display
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableBody>
                {filteredLogs.map(entry => (
                  <TableRow
                    key={entry.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                      '& td': { borderBottom: '1px solid rgba(224, 224, 224, 0.5)' }
                    }}
                  >
                    {showTimestamp && (
                      <TableCell 
                        sx={{ 
                          py: 0.5, 
                          px: 1, 
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                          width: 'auto'
                        }}
                      >
                        {entry.timestamp.slice(11, 23)}
                      </TableCell>
                    )}
                    {showLevel && (
                      <TableCell 
                        sx={{ 
                          py: 0.5, 
                          px: 1,
                          whiteSpace: 'nowrap',
                          width: 'auto'
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            mr: 0.5,
                            bgcolor: 
                              entry.level === 'error' ? 'error.main' : 
                              entry.level === 'warn' ? 'warning.main' : 
                              entry.level === 'info' ? 'info.main' : 
                              'success.main'
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell 
                      sx={{ 
                        py: 0.5, 
                        px: 1,
                        width: '100%'
                      }}
                    >
                      {entry.message}
                      {showData && entry.data && (
                        <Box
                          component="pre"
                          sx={{ 
                            mt: 0.5, 
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            overflowX: 'auto'
                          }}
                        >
                          {typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data, null, 2)}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
}

export default {
  ServerFunctionProvider,
  createServerFunction,
  executeServerBlock,
  useServerBlock,
  LogViewer,
  useServerConnection,
  useServerLogs
};