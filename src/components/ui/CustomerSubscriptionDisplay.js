// components/ui/CustomerSubscriptionDisplay.js
import React, { useState } from 'react';
import { LogViewer } from 'utils/use-server';
import useCustomerSubscription from 'components/ecosystems/CustomerSubscription';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Grid, 
  CircularProgress, 
  Alert, 
  AlertTitle,
  Tabs,
  Tab,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

/**
 * Customer Subscription Display Component
 * 
 * UI component that displays customer subscription data.
 * Uses the useCustomerSubscription hook for data fetching and management.
 */
function CustomerSubscriptionDisplay({ 
  subscriberIdentifier,
  neededRecords = 100,
  dbHost = 'localhost',
  dbName = 'database',
  dbTable = 'tablename',
  dbUsername = 'username',
  dbPassword = 'password',
  showLogViewer = true,
  md5Length = 8
}) {
  // Use the hook to get data and methods
  const {
    loading,
    error,
    customers,
    subscriptionInfo,
    refreshData
  } = useCustomerSubscription({
    subscriberIdentifier,
    neededRecords,
    dbHost,
    dbName,
    dbTable,
    dbUsername,
    dbPassword,
    md5Length
  });
  
  const [tabValue, setTabValue] = useState(0);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleExpandCustomer = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Loading subscription data...
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Customer Data Management
      </Typography>
      
      {subscriptionInfo && (
        <Paper sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="medium">
              Subscription Info
            </Typography>
            <Button 
              variant="contained"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={refreshData}
            >
              Refresh Data
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Total Records:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {subscriptionInfo.totalRecords}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">New Records Added:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {subscriptionInfo.newRecordsAdded}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Oldest Record:</Typography>
              <Typography variant="body2">
                {subscriptionInfo.oldestRecord 
                  ? new Date(subscriptionInfo.oldestRecord).toLocaleDateString() 
                  : 'N/A'}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2">Newest Record:</Typography>
              <Typography variant="body2">
                {subscriptionInfo.newestRecord 
                  ? new Date(subscriptionInfo.newestRecord).toLocaleDateString() 
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
          
          <Box mt={2}>
            <Chip 
              label={`File ID: ${subscriptionInfo.fileIdentifier}`} 
              variant="outlined" 
              color="secondary"
              size="small"
            />
          </Box>
        </Paper>
      )}
      
      <Box mb={3}>
        <Paper sx={{ borderRadius: '4px 4px 0 0' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Basic Information" />
            <Tab label="Billing Details" />
            <Tab label="Shipping Details" />
            <Tab label="Account Info" />
          </Tabs>
        </Paper>
        
        <TableContainer component={Paper} sx={{ borderRadius: '0 0 4px 4px' }}>
          {customers.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body1">No customer data available</Typography>
            </Box>
          ) : (
            <>
              {/* Basic Information Tab */}
              {tabValue === 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell>Customer ID</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Phone</StyledTableCell>
                      <StyledTableCell>Fax</StyledTableCell>
                      <StyledTableCell>Member Since</StyledTableCell>
                      <StyledTableCell>Last Updated</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map(customer => (
                      <React.Fragment key={customer.cID}>
                        <TableRow>
                          <TableCell>{customer.cID}</TableCell>
                          <TableCell>{customer.cString}</TableCell>
                          <TableCell>
                            <Tooltip title={customer.cBillCompany ? `Company: ${customer.cBillCompany}` : ""}>
                              <span>{customer.cBillFname} {customer.cBillLname}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {customer.cEmail}
                              <IconButton size="small" onClick={() => copyToClipboard(customer.cEmail)}>
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>{customer.cPhone}</TableCell>
                          <TableCell>{customer.cFax || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(customer.cDateSince).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(customer.cUpdateDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => handleExpandCustomer(customer.cID)}
                              color={expandedCustomer === customer.cID ? "primary" : "default"}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                        {expandedCustomer === customer.cID && (
                          <TableRow>
                            <TableCell colSpan={9} sx={{ p: 0 }}>
                              <Box p={2} bgcolor="grey.50">
                                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                  Additional Information
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2">Reference:</Typography>
                                    <Typography>{customer.cMemo || 'N/A'}</Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2">How Found:</Typography>
                                    <Typography>{customer.cHow || 'N/A'}</Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2">Wholesale Discount:</Typography>
                                    <Typography>
                                      {customer.cWholesaleDiscount ? `${customer.cWholesaleDiscount}%` : 'None'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Billing Details Tab */}
              {tabValue === 1 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell>Company</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Address</StyledTableCell>
                      <StyledTableCell>City</StyledTableCell>
                      <StyledTableCell>State/Province</StyledTableCell>
                      <StyledTableCell>Postal Code</StyledTableCell>
                      <StyledTableCell>County</StyledTableCell>
                      <StyledTableCell>Country</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map(customer => (
                      <TableRow key={customer.cID}>
                        <TableCell>{customer.cID}</TableCell>
                        <TableCell>{customer.cBillCompany || 'N/A'}</TableCell>
                        <TableCell>{customer.cBillFname} {customer.cBillLname}</TableCell>
                        <TableCell>
                          {customer.cBillAddress1}
                          {customer.cBillAddress2 && (
                            <Typography variant="body2" color="text.secondary">
                              {customer.cBillAddress2}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{customer.cBillCity}</TableCell>
                        <TableCell>{customer.cBillState || 'N/A'}</TableCell>
                        <TableCell>{customer.cBillZip}</TableCell>
                        <TableCell>{customer.bill_county || 'N/A'}</TableCell>
                        <TableCell>{customer.cBillCountry}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Shipping Details Tab */}
              {tabValue === 2 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell>Same as Billing</StyledTableCell>
                      <StyledTableCell>Company</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Address</StyledTableCell>
                      <StyledTableCell>City</StyledTableCell>
                      <StyledTableCell>State/Province</StyledTableCell>
                      <StyledTableCell>Postal Code</StyledTableCell>
                      <StyledTableCell>County</StyledTableCell>
                      <StyledTableCell>Country</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map(customer => (
                      <TableRow key={customer.cID}>
                        <TableCell>{customer.cID}</TableCell>
                        <TableCell>
                          {customer.billEqualShip === '1' ? (
                            <Chip size="small" label="Yes" color="success" />
                          ) : (
                            <Chip size="small" label="No" color="default" />
                          )}
                        </TableCell>
                        <TableCell>{customer.cShipCompany || 'N/A'}</TableCell>
                        <TableCell>{customer.cShipFname} {customer.cShipLname}</TableCell>
                        <TableCell>
                          {customer.cShipAddress1}
                          {customer.cShipAddress2 && (
                            <Typography variant="body2" color="text.secondary">
                              {customer.cShipAddress2}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{customer.cShipCity}</TableCell>
                        <TableCell>{customer.cShipState || 'N/A'}</TableCell>
                        <TableCell>{customer.cShipZip}</TableCell>
                        <TableCell>{customer.ship_county || 'N/A'}</TableCell>
                        <TableCell>{customer.cShipCountry}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Account Info Tab */}
              {tabValue === 3 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Password Status</StyledTableCell>
                      <StyledTableCell>Password Hint</StyledTableCell>
                      <StyledTableCell>Account Status</StyledTableCell>
                      <StyledTableCell>Last Error</StyledTableCell>
                      <StyledTableCell>Lock Time</StyledTableCell>
                      <StyledTableCell>Lock IP</StyledTableCell>
                      <StyledTableCell>Lock Count</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map(customer => (
                      <TableRow key={customer.cID}>
                        <TableCell>{customer.cID}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {customer.cEmail}
                            <IconButton size="small" onClick={() => copyToClipboard(customer.cEmail)}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {customer.cPass ? (
                            <Chip size="small" label="Set" color="success" />
                          ) : (
                            <Chip size="small" label="Not Set" color="error" />
                          )}
                        </TableCell>
                        <TableCell>{customer.cPassHint || 'N/A'}</TableCell>
                        <TableCell>
                          {customer.cLocknum && parseInt(customer.cLocknum) > 0 ? (
                            <Chip size="small" label="Locked" color="error" />
                          ) : (
                            <Chip size="small" label="Active" color="success" />
                          )}
                        </TableCell>
                        <TableCell>{customer.cLasterr || 'None'}</TableCell>
                        <TableCell>{customer.cLocktime || 'N/A'}</TableCell>
                        <TableCell>{customer.cLockip || 'N/A'}</TableCell>
                        <TableCell>{customer.cLocknum || '0'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </TableContainer>
      </Box>
      
      {showLogViewer && (
        <Box mt={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight="medium">
                System Logs
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 1, bgcolor: 'grey.100' }}>
                <LogViewer 
                  maxHeight="200px" 
                  showTimestamp={true}
                  showLevel={true}
                  maxItems={20}
                />
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
}

export default CustomerSubscriptionDisplay;