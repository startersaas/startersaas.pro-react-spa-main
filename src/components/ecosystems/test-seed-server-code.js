// components/ecosystems/test-seed-server-code.js
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Configuration
const DB_CONFIG = {
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database'
};

// Number of customer records to generate
const NUM_RECORDS = 500;

// Helper function to create MD5 hash
const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');

// Helper function to get a random substring of an MD5 hash
const getRandomMd5Substring = (length = 8) => {
  const randomData = crypto.randomBytes(16).toString('hex');
  const hash = md5(randomData);
  return hash.substring(0, length);
};

// Helper function to generate a random email address
const generateRandomEmail = () => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'mail.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const username = getRandomMd5Substring(8).toLowerCase();
  return `${username}@${randomDomain}`;
};

// Helper function to generate a random phone number in format (XXX) XXX-XXXX
const generateRandomPhone = () => {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${prefix}-${lineNumber}`;
};

// Helper function to generate a random address
const generateRandomAddress = () => {
  const houseNumber = Math.floor(Math.random() * 9000) + 100;
  const streetNames = ['Main St', 'Oak Ave', 'Maple Dr', 'Washington Blvd', 'Lincoln Rd', 'Park Ave', 'Cedar Ln', 'Elm St', 'Lake Dr', 'Pine St'];
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  return `${houseNumber} ${streetName}`;
};

// Helper function to generate random address line 2
const generateRandomAddressLine2 = () => {
  const types = ['Apt', 'Suite', 'Unit', '#'];
  const type = types[Math.floor(Math.random() * types.length)];
  const number = Math.floor(Math.random() * 1000) + 1;
  
  // 50% chance of returning null
  return Math.random() > 0.5 ? `${type} ${number}` : null;
};

// Helper function to generate a random city
const generateRandomCity = () => {
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Boston'];
  return cities[Math.floor(Math.random() * cities.length)];
};

// Helper function to generate a random state
const generateRandomState = () => {
  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  return states[Math.floor(Math.random() * states.length)];
};

// Helper function to generate a random ZIP code
const generateRandomZip = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

// Helper function to generate a random country
const generateRandomCountry = () => {
  // Most records will be US
  return Math.random() > 0.1 ? 'US' : 'CA';
};

// Helper function to generate a random county
const generateRandomCounty = () => {
  const counties = ['Adams', 'Allen', 'Anderson', 'Baker', 'Butler', 'Clark', 'Clay', 'Crawford', 'Davis', 'Douglas', 'Franklin', 'Grant', 'Greene', 'Hamilton', 'Harrison', 'Jackson', 'Jefferson', 'Johnson', 'Lake', 'Lee', 'Lincoln', 'Madison', 'Marion', 'Monroe', 'Morgan', 'Orange', 'Perry', 'Scott', 'Union', 'Washington', 'Wayne', 'Wilson', 'Wood'];
  
  // 30% chance of returning null
  return Math.random() > 0.3 ? counties[Math.floor(Math.random() * counties.length)] : null;
};

// Helper function to generate a random company name
const generateRandomCompany = () => {
  const prefixes = ['Advanced', 'Global', 'Premier', 'Elite', 'Superior', 'Innovative', 'Strategic', 'Dynamic', 'Pacific', 'Atlantic', 'Universal', 'United', 'National', 'International', 'Metropolitan'];
  const cores = ['Tech', 'Solutions', 'Systems', 'Services', 'Industries', 'Enterprises', 'Group', 'Partners', 'Associates', 'Consulting', 'Management', 'Development', 'Resources', 'Logistics', 'Networks'];
  const suffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Co', 'Corporation', 'Limited', 'Group', 'Holdings', 'International'];
  
  const usePrefix = Math.random() > 0.3;
  const useSuffix = Math.random() > 0.5;
  
  let company = '';
  if (usePrefix) {
    company += prefixes[Math.floor(Math.random() * prefixes.length)] + ' ';
  }
  
  company += cores[Math.floor(Math.random() * cores.length)];
  
  if (useSuffix) {
    company += ' ' + suffixes[Math.floor(Math.random() * suffixes.length)];
  }
  
  // 40% chance of returning null for company name
  return Math.random() > 0.6 ? company : null;
};

// Helper function to generate a random first name
const generateRandomFirstName = () => {
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Nancy', 'Christopher', 'Lisa', 'Daniel', 'Margaret', 'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Ashley', 'Donald', 'Dorothy', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Edward', 'Stephanie'];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
};

// Helper function to generate a random last name
const generateRandomLastName = () => {
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};

// Helper function to generate a unique customer string
const generateUniqueCustomerString = () => {
  return getRandomMd5Substring(35);
};

// Helper function to generate random "How did you hear about us"
const generateRandomHow = () => {
  const howOptions = ['Google', 'Friend Referral', 'Facebook', 'Instagram', 'Email Newsletter', 'Magazine Ad', 'TV Commercial', 'Radio Ad', 'Trade Show', 'Direct Mail', 'LinkedIn', 'Twitter', 'Blog', 'YouTube'];
  
  // 50% chance of returning null
  return Math.random() > 0.5 ? howOptions[Math.floor(Math.random() * howOptions.length)] : null;
};

// Helper function to generate a random password
const generateRandomPassword = () => {
  return getRandomMd5Substring(10);
};

// Helper function to generate a random password hint
const generateRandomPasswordHint = () => {
  const hints = ['Pet name', 'Birthday', 'Favorite color', 'Mother\'s name', 'Favorite movie', 'First car', 'Elementary school', 'Childhood street'];
  
  // 60% chance of returning null
  return Math.random() > 0.6 ? hints[Math.floor(Math.random() * hints.length)] : null;
};

// Helper function to generate a random memo
const generateRandomMemo = () => {
  const memos = ['Prefers email contact', 'Do not call', 'VIP customer', 'Special shipping instructions', 'Credit issues', 'Returning customer', 'Wholesale account', 'Credit on file', 'Requires follow-up'];
  
  // 70% chance of returning null
  return Math.random() > 0.7 ? memos[Math.floor(Math.random() * memos.length)] : null;
};

// Helper function to generate a random date within the past 5 years
const generateRandomDate = () => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 5); // Past 5 years
  return pastDate.toISOString().slice(0, 19).replace('T', ' ');
};

// Helper function to generate a random update date after the since date
const generateRandomUpdateDate = (sinceDate) => {
  const since = new Date(sinceDate);
  const now = new Date();
  const updateDate = new Date(since.getTime() + Math.random() * (now.getTime() - since.getTime()));
  return updateDate.toISOString().slice(0, 19).replace('T', ' ');
};

// Helper function to generate a random wholesale discount
const generateRandomDiscount = () => {
  // 70% chance of returning null
  return Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 5 : null;
};

// Helper function to generate random lasterr
const generateRandomLasterr = () => {
  // 90% chance of returning null
  return Math.random() > 0.9 ? `Error at ${generateRandomDate()}` : null;
};

// Helper function to generate random locktime
const generateRandomLocktime = () => {
  // 90% chance of returning null
  return Math.random() > 0.9 ? generateRandomDate() : null;
};

// Helper function to generate random lockip
const generateRandomLockip = () => {
  // Generate a random IP address
  const octet = () => Math.floor(Math.random() * 256);
  const ip = `${octet()}.${octet()}.${octet()}.${octet()}`;
  
  // 90% chance of returning null
  return Math.random() > 0.9 ? ip : null;
};

// Helper function to generate random locknum
const generateRandomLocknum = () => {
  return Math.random() > 0.9 ? String(Math.floor(Math.random() * 10)) : '0';
};

// Main function to seed the database
async function seedDatabase() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('Connected to database!');
    
    // Drop table if exists and create new table
    console.log('Dropping existing table and creating new one...');
    await connection.execute('DROP TABLE IF EXISTS ds_customers');
    
    // Create the table structure
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS \`ds_customers\` (
      \`cID\` int(11) NOT NULL AUTO_INCREMENT,
      \`pgID\` int(11) DEFAULT NULL,
      \`cString\` varchar(35) NOT NULL DEFAULT '',
      \`cBillCompany\` varchar(50) DEFAULT NULL,
      \`cBillFname\` varchar(45) NOT NULL DEFAULT '',
      \`cBillLname\` varchar(35) NOT NULL DEFAULT '',
      \`cBillAddress1\` varchar(50) NOT NULL DEFAULT '',
      \`cBillAddress2\` varchar(50) DEFAULT NULL,
      \`cBillCity\` varchar(40) NOT NULL DEFAULT '',
      \`cBillState\` varchar(40) DEFAULT NULL,
      \`cBillZip\` varchar(25) NOT NULL DEFAULT '',
      \`bill_county\` varchar(100) DEFAULT NULL,
      \`cBillCountry\` varchar(30) NOT NULL DEFAULT '',
      \`cPhone\` varchar(25) NOT NULL DEFAULT '',
      \`cFax\` varchar(25) DEFAULT NULL,
      \`cHow\` varchar(40) DEFAULT NULL,
      \`billEqualShip\` char(1) NOT NULL DEFAULT '',
      \`cShipCompany\` varchar(50) DEFAULT NULL,
      \`cShipFname\` varchar(40) NOT NULL DEFAULT '',
      \`cShipLname\` varchar(40) NOT NULL DEFAULT '',
      \`cShipAddress1\` varchar(50) NOT NULL DEFAULT '',
      \`cShipAddress2\` varchar(50) DEFAULT NULL,
      \`cShipCity\` varchar(40) NOT NULL DEFAULT '',
      \`cShipState\` varchar(40) DEFAULT NULL,
      \`cShipZip\` varchar(25) NOT NULL DEFAULT '',
      \`ship_county\` varchar(100) DEFAULT NULL,
      \`cShipCountry\` varchar(30) NOT NULL DEFAULT '',
      \`cEmail\` varchar(80) NOT NULL DEFAULT '',
      \`cPass\` varchar(15) NOT NULL DEFAULT '',
      \`cPassHint\` varchar(20) DEFAULT NULL,
      \`cMemo\` varchar(50) DEFAULT NULL,
      \`cDateSince\` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      \`cUpdateDate\` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
      \`cWholesaleDiscount\` float(10,1) DEFAULT NULL,
      \`cLasterr\` varchar(55) DEFAULT NULL,
      \`cLocktime\` varchar(55) DEFAULT NULL,
      \`cLockip\` varchar(55) DEFAULT NULL,
      \`cLocknum\` varchar(10) NOT NULL DEFAULT '0',
      PRIMARY KEY (\`cID\`),
      UNIQUE KEY \`cString\` (\`cString\`),
      UNIQUE KEY \`cID\` (\`cID\`),
      UNIQUE KEY \`cEmail_unique\` (\`cEmail\`),
      KEY \`cEmail_index\` (\`cEmail\`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;
    
    await connection.execute(createTableSQL);
    console.log('Table created successfully!');
    
    console.log(`Generating ${NUM_RECORDS} customer records...`);
    
    for (let i = 0; i < NUM_RECORDS; i++) {
      // Generate a customer record
      const billEqualShip = Math.random() > 0.3 ? 'Y' : 'N';
      
      // Generate base customer data
      const cBillFname = generateRandomFirstName();
      const cBillLname = generateRandomLastName();
      const cBillCompany = generateRandomCompany();
      const cBillAddress1 = generateRandomAddress();
      const cBillAddress2 = generateRandomAddressLine2();
      const cBillCity = generateRandomCity();
      const cBillState = generateRandomState();
      const cBillZip = generateRandomZip().toString();
      const bill_county = generateRandomCounty();
      const cBillCountry = generateRandomCountry();
      const cPhone = generateRandomPhone();
      const cFax = Math.random() > 0.8 ? generateRandomPhone() : null;
      const cEmail = generateRandomEmail();
      const cString = generateUniqueCustomerString();
      const cDateSince = generateRandomDate();
      
      // If billing equals shipping, use billing info for shipping
      const cShipFname = billEqualShip === 'Y' ? cBillFname : generateRandomFirstName();
      const cShipLname = billEqualShip === 'Y' ? cBillLname : generateRandomLastName();
      const cShipCompany = billEqualShip === 'Y' ? cBillCompany : generateRandomCompany();
      const cShipAddress1 = billEqualShip === 'Y' ? cBillAddress1 : generateRandomAddress();
      const cShipAddress2 = billEqualShip === 'Y' ? cBillAddress2 : generateRandomAddressLine2();
      const cShipCity = billEqualShip === 'Y' ? cBillCity : generateRandomCity();
      const cShipState = billEqualShip === 'Y' ? cBillState : generateRandomState();
      const cShipZip = billEqualShip === 'Y' ? cBillZip : generateRandomZip().toString();
      const ship_county = billEqualShip === 'Y' ? bill_county : generateRandomCounty();
      const cShipCountry = billEqualShip === 'Y' ? cBillCountry : generateRandomCountry();
      
      // Other random fields
      const pgID = Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null;
      const cHow = generateRandomHow();
      const cPass = generateRandomPassword();
      const cPassHint = generateRandomPasswordHint();
      const cMemo = generateRandomMemo();
      const cUpdateDate = generateRandomUpdateDate(cDateSince);
      const cWholesaleDiscount = generateRandomDiscount();
      const cLasterr = generateRandomLasterr();
      const cLocktime = generateRandomLocktime();
      const cLockip = generateRandomLockip();
      const cLocknum = generateRandomLocknum();
      
      // Insert the customer record
      const query = `
        INSERT INTO ds_customers (
          pgID, cString, cBillCompany, cBillFname, cBillLname, 
          cBillAddress1, cBillAddress2, cBillCity, cBillState, cBillZip, 
          bill_county, cBillCountry, cPhone, cFax, cHow, 
          billEqualShip, cShipCompany, cShipFname, cShipLname, cShipAddress1, 
          cShipAddress2, cShipCity, cShipState, cShipZip, ship_county, 
          cShipCountry, cEmail, cPass, cPassHint, cMemo, 
          cDateSince, cUpdateDate, cWholesaleDiscount, cLasterr, cLocktime, 
          cLockip, cLocknum
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        pgID, cString, cBillCompany, cBillFname, cBillLname,
        cBillAddress1, cBillAddress2, cBillCity, cBillState, cBillZip,
        bill_county, cBillCountry, cPhone, cFax, cHow,
        billEqualShip, cShipCompany, cShipFname, cShipLname, cShipAddress1,
        cShipAddress2, cShipCity, cShipState, cShipZip, ship_county,
        cShipCountry, cEmail, cPass, cPassHint, cMemo,
        cDateSince, cUpdateDate, cWholesaleDiscount, cLasterr, cLocktime,
        cLockip, cLocknum
      ];
      
      try {
        await connection.execute(query, values);
        if ((i + 1) % 50 === 0 || i === NUM_RECORDS - 1) {
          console.log(`Inserted ${i + 1} records...`);
        }
      } catch (insertError) {
        // If there's a duplicate key, retry with a new unique string or email
        if (insertError.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry detected at record ${i + 1}, retrying...`);
          i--; // Retry this iteration
          continue;
        } else {
          throw insertError;
        }
      }
    }
    
    console.log(`Successfully inserted ${NUM_RECORDS} customer records!`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (connection) {
      console.log('Closing database connection...');
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

// Run the seeding process
seedDatabase();

