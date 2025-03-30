// components/ecosystems/CustomerSubscription.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useServerLogs } from 'utils/use-server';

/**
 * useCustomerSubscription Hook
 * 
 * Custom hook that handles customer subscription data loading and management.
 * Uses server markers to handle database operations and file management.
 */
function useCustomerSubscription({ 
  subscriberIdentifier,
  neededRecords = 100,
  dbHost = 'localhost',
  dbName = 'database',
  dbTable = 'tablename',
  dbUsername = 'username',
  dbPassword = 'password',
  md5Length = 8
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const { addLog } = useServerLogs();
  
  // Use refs to prevent dependency changes from causing infinite loops
  const paramsRef = useRef({
    subscriberIdentifier,
    neededRecords,
    dbHost,
    dbName,
    dbTable,
    dbUsername,
    dbPassword,
    md5Length
  });
  
  // Update ref values when props change
  useEffect(() => {
    paramsRef.current = {
      subscriberIdentifier,
      neededRecords,
      dbHost,
      dbName,
      dbTable,
      dbUsername,
      dbPassword,
      md5Length
    };
  }, [subscriberIdentifier, neededRecords, dbHost, dbName, dbTable, dbUsername, dbPassword, md5Length]);
  
  // Load customer data using server function
  const loadCustomerData = useCallback(async () => {
    const params = paramsRef.current;
    
    if (!params.subscriberIdentifier) {
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
      const result = await window.__executeServerMarker(blockId, [
        params.subscriberIdentifier,
        params.md5Length,
        params.neededRecords,
        params.dbHost,
        params.dbUsername,
        params.dbPassword,
        params.dbName,
        params.dbTable
      ]);
      
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
  }, [addLog]); // Reduced dependencies to avoid re-creating this function
  
  // Load data on first render and when subscriberIdentifier changes
  useEffect(() => {
    loadCustomerData();
    
    // We explicitly don't want to reload on every prop change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriberIdentifier]); // Only reload when the identifier changes
  
  // Server code block - Handles file checking and customer data retrieval
  // @eserver-begin
  /* eslint-disable */
  try {
    // Get parameters from args
    const subscriberIdentifier = args[0];
    const md5Length = parseInt(args[1], 10) || 8;
    const neededRecordsCount = parseInt(args[2], 10) || 100;
    const host = args[3] || 'localhost';
    const user = args[4] || 'username'; 
    const password = args[5] || 'password';
    const database = args[6] || 'database';
    const tableName = args[7] || 'ds_customers';
    
    if (!subscriberIdentifier) {
      return { error: "No subscriber identifier provided" };
    }
    
    // Required modules
    const fs = require('fs').promises;
    const path = require('path');
    const mysql = require('mysql2/promise');
    const crypto = require('crypto');
    
    // Generate a consistent file identifier based on subscriber
    function getFileIdentifier(identifier, hashLength) {
      // Create MD5 hash of subscriber identifier
      const md5Hash = crypto.createHash('md5').update(identifier).digest('hex');
      return `temp${identifier}_${md5Hash.substring(0, hashLength)}`;
    }
    
    // Generate the file identifier
    const fileIdentifier = getFileIdentifier(subscriberIdentifier, md5Length);
    
    // File storage location
    const storageDir = '/var/www';
    const filePath = path.join(storageDir, `${fileIdentifier}.store`);
    
    // Database connection function
    async function getDbConnection() {
      try {
        return await mysql.createConnection({
          host: host,
          user: user,
          password: password,
          database: database
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
    const neededRecords = neededRecordsCount - validRecords.length;
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
          FROM ${tableName} 
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
          SELECT * FROM ${tableName} 
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
  
  // Expose method to manually refresh data
  const refreshData = useCallback(() => {
    return loadCustomerData();
  }, [loadCustomerData]);
  
  // Return data and methods as a hook
  return {
    loading,
    error,
    customers,
    subscriptionInfo,
    refreshData
  };
}

export default useCustomerSubscription;