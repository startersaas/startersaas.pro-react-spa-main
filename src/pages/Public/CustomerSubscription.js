// pages/Public/CustomerSubscription
import React, { useState, useEffect, useCallback } from 'react';
import { useServerLogs, LogViewer } from 'utils/use-server';
import crypto from 'crypto';

/**
 * Customer Subscription Component
 * 
 * Provides access to the latest 100 customer records for subscribers.
 * Uses server markers to handle database operations and file management.
 */
function CustomerSubscription({ subscriberIdentifier }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const { addLog } = useServerLogs();
  
  // Generate a consistent file identifier based on subscriber
  const getFileIdentifier = useCallback(() => {
    if (!subscriberIdentifier) return null;
    
    // Create MD5 hash of subscriber identifier
    const md5Hash = crypto.createHash('md5').update(subscriberIdentifier).digest('hex');
    return `temp${subscriberIdentifier}_${md5Hash.substring(0, 8)}`;
  }, [subscriberIdentifier]);
  
  // Load customer data using server function
  const loadCustomerData = useCallback(async () => {
    if (!subscriberIdentifier) {
      setError("No subscriber identifier provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Find the block ID 
      const blockId = Object.keys(window.__serverMarkers || {}).find(id => 
        id.includes('_block_') && 
        id.includes('CustomerSubscription_js')
      );
      
      if (!blockId) {
        throw new Error('Customer subscription server block not found');
      }
      
      // Execute the server block with the subscriber identifier
      const fileIdentifier = getFileIdentifier();
      const result = await window.__executeServerMarker(blockId, [fileIdentifier]);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setCustomers(result.customers || []);
      setSubscriptionInfo(result.subscriptionInfo);
      
    } catch (err) {
      console.error("Error loading customer data:", err);
      setError(err.message);
      addLog('error', `Customer subscription error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [subscriberIdentifier, getFileIdentifier, addLog]);
  
  // Load data on first render
  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);
  
  // Server code block - Handles file checking and customer data retrieval
  // @eserver-begin
  /* eslint-disable */
  try {
    // Get file identifier from args
    const fileIdentifier = args[0];
    if (!fileIdentifier) {
      return { error: "No file identifier provided" };
    }
    
    // Required modules
    const fs = require('fs').promises;
    const path = require('path');
    const mysql = require('mysql2/promise');
    
    // File storage location
    const storageDir = '/var/www';
    const filePath = path.join(storageDir, `${fileIdentifier}.store`);
    
    // Database connection function
    async function getDbConnection() {
      try {
        return await mysql.createConnection({
          host: 'localhost',
          user: 'username', // Replace with actual DB username
          password: 'password', // Replace with actual DB password
          database: 'database'
        });
      } catch (error) {
        throw new Error(`Database connection error: ${error.message}`);
      }
    }
    
    // Get current timestamp
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Function to read subscription file
    async function readSubscriptionFile() {
      try {
        // Check if file exists
        await fs.access(filePath);
        
        // Read file content
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');
        
        // Parse records (cID, timestamp)
        return lines.map(line => {
          const [cID, dateTime] = line.split(',').map(part => part.trim());
          return {
            cID: parseInt(cID, 10),
            dateTime: new Date(dateTime)
          };
        });
      } catch (error) {
        // File doesn't exist or other error
        console.log(`Creating new subscription file: ${filePath}`);
        return [];
      }
    }
    
    // Function to write subscription file
    async function writeSubscriptionFile(records) {
      try {
        // Ensure directory exists
        try {
          await fs.mkdir(storageDir, { recursive: true });
        } catch (mkdirErr) {
          // Ignore if directory already exists
        }
        
        // Format records and write to file
        const content = records.map(record => 
          `${record.cID}, ${record.dateTime.toISOString()}`
        ).join('\n');
        
        await fs.writeFile(filePath, content, 'utf8');
        return true;
      } catch (error) {
        console.error(`Error writing subscription file: ${error.message}`);
        return false;
      }
    }
    
    // Get existing customer IDs in the current subscription
    const existingRecords = await readSubscriptionFile();
    
    // Filter out records older than 30 days
    const validRecords = existingRecords.filter(record => 
      record.dateTime >= thirtyDaysAgo
    );
    
    // Calculate how many new records we need
    const neededRecords = 100 - validRecords.length;
    let updatedRecords = [...validRecords];
    let subscriptionInfo = {
      totalRecords: validRecords.length,
      newRecordsAdded: 0,
      oldestRecord: validRecords.length > 0 ? 
        validRecords.reduce((oldest, record) => 
          record.dateTime < oldest.dateTime ? record : oldest
        ).dateTime : null,
      newestRecord: validRecords.length > 0 ? 
        validRecords.reduce((newest, record) => 
          record.dateTime > newest.dateTime ? record : newest
        ).dateTime : null
    };
    
    // If we need more records, query the database
    if (neededRecords > 0) {
      // Get database connection
      const conn = await getDbConnection();
      
      try {
        // Get existing customer IDs to exclude
        const existingIds = validRecords.map(record => record.cID);
        const excludeClause = existingIds.length > 0 ? 
          `AND cID NOT IN (${existingIds.join(',')})` : '';
        
        // Query to get new customer records
        const query = `
          SELECT cID, cDateSince 
          FROM ds_customers 
          WHERE 1=1 ${excludeClause}
          ORDER BY cID ASC
          LIMIT ${neededRecords}
        `;
        
        const [rows] = await conn.execute(query);
        
        // Add new records with current timestamp
        const newRecords = rows.map(row => ({
          cID: row.cID,
          dateTime: now
        }));
        
        // Update subscription info
        subscriptionInfo.newRecordsAdded = newRecords.length;
        
        // Add to valid records
        updatedRecords = [...validRecords, ...newRecords];
        
        // Sort by date (newest first)
        updatedRecords.sort((a, b) => b.dateTime - a.dateTime);
        
        // Update subscription info with new dates
        if (updatedRecords.length > 0) {
          subscriptionInfo.oldestRecord = updatedRecords.reduce((oldest, record) => 
            record.dateTime < oldest.dateTime ? record : oldest
          ).dateTime;
          
          subscriptionInfo.newestRecord = updatedRecords.reduce((newest, record) => 
            record.dateTime > newest.dateTime ? record : newest
          ).dateTime;
        }
        
        // Write updated records to file
        await writeSubscriptionFile(updatedRecords);
      } finally {
        // Close database connection
        await conn.end();
      }
    }
    
    // Now fetch the full customer data for the IDs in our subscription
    const customerIds = updatedRecords.map(record => record.cID);
    
    // Get customer details if we have IDs
    let customers = [];
    if (customerIds.length > 0) {
      const conn = await getDbConnection();
      
      try {
        const query = `
          SELECT * FROM ds_customers 
          WHERE cID IN (${customerIds.join(',')})
          ORDER BY cUpdateDate DESC
        `;
        
        const [rows] = await conn.execute(query);
        customers = rows;
      } finally {
        await conn.end();
      }
    }
    
    // Return customer data and subscription info
    return {
      customers,
      subscriptionInfo: {
        ...subscriptionInfo,
        totalRecords: updatedRecords.length,
        fileIdentifier,
        filePath
      }
    };
  } catch (error) {
    console.error(`Server block error: ${error.message}`);
    return { 
      error: error.message,
      stack: error.stack
    };
  }
  /* eslint-enable */
  // @eserver-end
  
  if (loading) {
    return <div className="p-4">Loading subscription data...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Subscription</h1>
      
      {subscriptionInfo && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Subscription Info</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>Total Records:</div>
            <div>{subscriptionInfo.totalRecords}</div>
            
            <div>New Records Added:</div>
            <div>{subscriptionInfo.newRecordsAdded}</div>
            
            <div>Oldest Record:</div>
            <div>{subscriptionInfo.oldestRecord ? new Date(subscriptionInfo.oldestRecord).toLocaleDateString() : 'N/A'}</div>
            
            <div>Newest Record:</div>
            <div>{subscriptionInfo.newestRecord ? new Date(subscriptionInfo.newestRecord).toLocaleDateString() : 'N/A'}</div>
            
            <div>File ID:</div>
            <div>{subscriptionInfo.fileIdentifier}</div>
          </div>
        </div>
      )}
      
      <button 
        onClick={loadCustomerData}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Data
      </button>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Customer Data ({customers.length})</h2>
        
        {customers.length === 0 ? (
          <p>No customer data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Phone</th>
                  <th className="py-2 px-4 border">City</th>
                  <th className="py-2 px-4 border">Date Since</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.cID}>
                    <td className="py-2 px-4 border">{customer.cID}</td>
                    <td className="py-2 px-4 border">{customer.cBillFname} {customer.cBillLname}</td>
                    <td className="py-2 px-4 border">{customer.cEmail}</td>
                    <td className="py-2 px-4 border">{customer.cPhone}</td>
                    <td className="py-2 px-4 border">{customer.cBillCity}</td>
                    <td className="py-2 px-4 border">
                      {new Date(customer.cDateSince).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Debug Logs:</h2>
        <LogViewer 
          maxHeight="200px" 
          showTimestamp={true}
          showLevel={true}
          maxItems={20}
        />
      </div>
    </div>
  );
}

export default CustomerSubscription;

