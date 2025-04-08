// components/debugging/QueryDebugLogger.jsx
import React from 'react';
import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Query Debug Logger Component
 * 
 * Displays the status and data of React Query queries for debugging purposes.
 * 
 * @param {Object} props
 * @param {Array} props.queries - Array of query objects with name, isLoading, isError, error, and data properties
 */
const QueryDebugLogger = ({ queries = [] }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        width: '400px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Query Debug Log
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {queries.map((query, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography>{query.name}</Typography>
                <Box>
                  {query.isLoading && (
                    <Chip size="small" label="Loading" color="primary" sx={{ mr: 0.5 }} />
                  )}
                  {query.isError && (
                    <Chip size="small" label="Error" color="error" sx={{ mr: 0.5 }} />
                  )}
                  {!query.isLoading && !query.isError && (
                    <Chip size="small" label="Success" color="success" />
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {query.isError ? (
                <Box>
                  <Typography color="error" variant="subtitle2">Error:</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {query.error?.message || 'Unknown error'}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2">Data:</Typography>
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      overflow: 'auto',
                      maxHeight: '300px',
                      bgcolor: 'grey.100',
                      p: 1,
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {JSON.stringify(query.data, null, 2) || 'No data'}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        
        {queries.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No queries to display
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default QueryDebugLogger;

