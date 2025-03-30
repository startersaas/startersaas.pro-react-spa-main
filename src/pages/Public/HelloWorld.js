// pages/Public/HelloWorld.js
  /* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { createServerFunction, LogViewer } from 'utils/use-server';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Box, 
  Alert, 
  AlertTitle, 
  Divider, 
  CircularProgress
} from '@mui/material';

/**
 * Ultra-simple HelloWorld component with server markers
 */
function HelloWorld() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [rawResponse, setRawResponse] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  
  // Monitor WebSocket connection status
  useEffect(() => {
    const checkConnection = () => {
      if (window.globalConnection) {
        setConnectionStatus(window.globalConnection.connected ? 'connected' : 'disconnected');
      } else {
        setConnectionStatus('no connection');
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Server info markers
  // @eserver-register-next-line
  const serverTime = new Date().toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }); return serverTime;

  // @eserver-register-next-line
  const processInfo = { pid: process.pid, version: process.version, platform: process.platform, arch: process.arch }; return processInfo;

  // @eserver-register-next-line
  const serverInfo = function() { const os = require('os'); return { hostname: os.hostname(), cpus: os.cpus().length, totalMemory: Math.round(os.totalmem() / (1024 * 1024)) + ' MB', freeMemory: Math.round(os.freemem() / (1024 * 1024)) + ' MB', uptime: Math.round(os.uptime() / 60) + ' minutes' }; }(); return serverInfo;
  
  // Self-contained database query with better error handling
  // @eserver-register-next-line
  (function() { try { const mysql = require('mysql2/promise'); return { type: 'init', message: 'MySQL module loaded' }; } catch(e) { return { type: 'error', error: e.message }; } })();

  // URL getter using async IIFE pattern that matches our test script
  // @eserver-register-next-line
  //(async function() { try { const mysql = require('mysql2/promise'); let conn = null; try { conn = await mysql.createConnection({ host: 'localhost', user: 'jeffrey', password: 'mypass', database: 'pi_stored' }); const [rows] = await conn.execute('SELECT url FROM `localhost` ORDER BY id DESC LIMIT 1'); return { success: true, url: rows[0]?.url, rows: rows }; } catch(err) { return { success: false, error: err.message, stack: err.stack }; } finally { if (conn) await conn.end(); } } catch (e) { return { success: false, error: e.message, stack: e.stack, phase: 'outer' }; } })();
  
  // Multiline version of the URL getter using begin/end markers
  // Now the loader will automatically generate a unique function name and wrap the code
  // @eserver-begin
  try { 
    const mysql = require('mysql2/promise'); 
    let conn = null; 
    
    try { 
      // Create database connection
      // eslint-disable-next-line
      conn = await mysql.createConnection({ 
        host: 'localhost', 
        user: 'user', 
        password: 'password', 
        database: 'database' 
      }); 
      
      // Execute query to get the latest URL
      // eslint-disable-next-line
      const [rows] = await conn.execute('SELECT url FROM `localhost` ORDER BY id DESC LIMIT 1'); 
      
      // Return success with data
      return { 
        success: true, 
        url: rows[0]?.url, 
        rows: rows,
        timestamp: new Date().toISOString()
      }; 
    } catch(err) { 
      // Handle database errors
      return { 
        success: false, 
        error: err.message, 
        stack: err.stack 
      }; 
    } finally { 
      // Always close the connection
      if (conn) await conn.end(); 
    } 
  } catch (e) { 
    // Handle module loading errors
    return { 
      success: false, 
      error: e.message, 
      stack: e.stack, 
      phase: 'outer' 
    }; 
  }
  // @eserver-end
  
  // Get server information
  const getServerInfo = useCallback(async () => {
    if (!window.globalConnection || !window.globalConnection.connected) {
      setError('No WebSocket connection available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the marker IDs from our system (these match the file path and line numbers)
      const markerIds = Object.keys(window.__serverMarkers || {}).filter(id => 
        id.includes('HelloWorld_js')
      );
      
      // Execute all our markers
      const results = await Promise.all(
        markerIds.map(id => window.__executeServerMarker(id))
      );
      
      // Extract results by type
      const timeResult = results.find(r => typeof r === 'string' && r.includes(':'));
      const processResult = results.find(r => r && r.pid);
      const systemResult = results.find(r => r && r.hostname);
      
      setResult({
        serverTime: timeResult,
        process: processResult,
        system: systemResult
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch background image URL using the multiline server block
  const fetchBackgroundImage = useCallback(async () => {
    if (!window.globalConnection || !window.globalConnection.connected) {
      setError('No WebSocket connection available');
      return;
    }
    
    setLoading(true);
    setError(null);
    setRawResponse('');
    
    try {
      // First test if MySQL is available using the single-line marker
      const initMarkerId = Object.keys(window.__serverMarkers || {}).filter(id => 
        window.__serverMarkers[id].includes('type: \'init\'')
      )[0];
      
      if (initMarkerId) {
        const initResult = await window.__executeServerMarker(initMarkerId);
        console.log("MySQL init result:", initResult);
        setRawResponse(prev => prev + "MySQL Test: " + JSON.stringify(initResult, null, 2) + "\n\n");
      }
      
      // Find the block ID directly
      const blockId = Object.keys(window.__serverMarkers || {}).find(id => 
        id.includes('_block_') && 
        id.includes('HelloWorld_js')
      );
      
      if (!blockId) {
        throw new Error('Background URL block not found');
      }
      
      console.log("Found block with ID:", blockId);
      console.log("Block code:", window.__serverMarkers[blockId]);
      
      // Execute the block directly
      const urlResult = await window.__executeServerMarker(blockId);
      console.log("URL result from block:", urlResult);
      
      setRawResponse(prev => prev + "URL Result: " + JSON.stringify(urlResult, null, 2));
      
      if (urlResult && urlResult.success && urlResult.url) {
        setBackgroundUrl(urlResult.url);
      } else {
        setError((urlResult && urlResult.error) || 'Failed to fetch background URL');
      }
    } catch (error) {
      console.error("Error in fetchBackgroundImage:", error);
      setError(error.message);
      setRawResponse(JSON.stringify({
        error: error.message,
        stack: error.stack
      }, null, 2));
    } finally {
      setLoading(false);
    }
  }, []);
  
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        padding: 3,
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.9)' 
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Hello World with Server Functions
          </Typography>
          
          <Box mb={3}>
            <Typography variant="body1">
              WebSocket Connection Status: {' '}
              <Box 
                component="span" 
                sx={{ 
                  color: connectionStatus === 'connected' ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                {connectionStatus}
              </Box>
            </Typography>
          </Box>
          
          <Box mb={3} sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={getServerInfo}
              disabled={loading || connectionStatus !== 'connected'}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Loading...' : 'Get Server Info'}
            </Button>
            
            <Button
              variant="contained"
              color="success"
              onClick={fetchBackgroundImage}
              disabled={loading || connectionStatus !== 'connected'}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              Fetch Background
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          
          {result && !error && (
            <Box mt={3} mb={3}>
              <Typography variant="h6" gutterBottom>
                Server Response:
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'grey.100',
                  overflowX: 'auto'
                }}
              >
                <pre>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
          
          {rawResponse && (
            <Box mt={3} mb={3}>
              <Typography variant="h6" gutterBottom>
                Background Image Data:
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'grey.100',
                  overflowX: 'auto'
                }}
              >
                <pre>
                  {rawResponse}
                </pre>
              </Paper>
            </Box>
          )}
          
          {backgroundUrl && (
            <Box mt={3} mb={3}>
              <Typography variant="h6" gutterBottom>
                Active Background URL:
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'grey.100',
                  wordBreak: 'break-all'
                }}
              >
                {backgroundUrl}
              </Paper>
            </Box>
          )}
          
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Debug Logs:
            </Typography>
            <Paper variant="outlined">
              <LogViewer 
                maxHeight="300px" 
                showTimestamp={true}
                showLevel={true}
                showData={true}
                maxItems={50}
              />
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default HelloWorld;