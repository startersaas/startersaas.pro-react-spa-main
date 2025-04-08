// pages/Workspaces/DatabaseTab.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination
} from '@mui/material';
import { useTranslation } from "react-i18next";
import Loader from "components/atoms/Loader";
import DatabaseIcon from '@mui/icons-material/Dns';
import TableChartIcon from '@mui/icons-material/TableChart';

const DatabaseTab = ({ 
  workspace, 
  isLoadingTableData, 
  handleLoadData, 
  loadData, 
  tableData, 
  page, 
  rowsPerPage, 
  handleChangePage, 
  handleChangeRowsPerPage 
}) => {
  const { t } = useTranslation();

  const renderDatabaseInfo = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <DatabaseIcon />
          </Grid>
          <Grid item>
            {t("viewWorkspacePage.databaseConnection", "Database Connection")}
          </Grid>
        </Grid>
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.host", "Host")}
          </Typography>
          <Typography>{workspace.mysqlHost || "-"}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.port", "Port")}
          </Typography>
          <Typography>{workspace.mysqlPort || "3306"}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.database", "Database")}
          </Typography>
          <Typography>{workspace.mysqlDatabase || "-"}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.table", "Table")}
          </Typography>
          <Typography>{workspace.mysqlTable || "-"}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.user", "User")}
          </Typography>
          <Typography>{workspace.mysqlUser || "-"}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.connectionType", "Connection Type")}
          </Typography>
          <Typography>{workspace.mysqlConnectionType || "direct"}</Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          onClick={handleLoadData}
          disabled={isLoadingTableData || !workspace.mysqlHost || !workspace.mysqlTable}
        >
          {isLoadingTableData ? 
            t("viewWorkspacePage.loading", "Loading...") : 
            t("viewWorkspacePage.loadData", "Load Table Data")}
        </Button>
      </Box>
    </Paper>
  );

  const renderTableData = () => {
    if (!loadData) return null;
    
    if (isLoadingTableData) {
      return <Loader />;
    }

    // Handle the complex nested data structure that's being returned
    // First check if the data follows the expected structure from the API response
    let rows = [];
    
    // Try different data paths based on the API response structure
    if (tableData?.data?.data?.rows) {
      rows = tableData.data.data.rows;
    } else if (tableData?.data?.rows) {
      rows = tableData.data.rows;
    } else if (Array.isArray(tableData?.data)) {
      rows = tableData.data;
    }
    
    // If we still have no rows, check if data itself is an object with properties
    if (rows.length === 0 && typeof tableData?.data === 'object' && tableData?.data !== null) {
      const nestedData = tableData.data.data || tableData.data;
      if (nestedData && typeof nestedData === 'object' && !Array.isArray(nestedData)) {
        // If data is a non-array object, it might be a single record
        rows = [nestedData];
      }
    }

    if (rows.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            {t("viewWorkspacePage.noDataFound", "No data found in table")}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Data structure received: {JSON.stringify({
              hasDataProperty: !!tableData?.data,
              dataType: typeof tableData?.data,
              hasNestedData: !!tableData?.data?.data,
              hasRows: !!tableData?.data?.rows || !!tableData?.data?.data?.rows,
            })}
          </Typography>
        </Paper>
      );
    }

    // Extract columns from the first row if we don't have column information
    const columns = Array.isArray(tableData?.data?.data?.columns) 
      ? tableData.data.data.columns 
      : (Array.isArray(tableData?.data?.columns) 
          ? tableData.data.columns 
          : (rows.length > 0 ? Object.keys(rows[0]).map(key => ({ name: key })) : []));

    return (
      <Paper sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <TableChartIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.tableData", "Table Data")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${rows.length} ${t("viewWorkspacePage.records", "records")}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell key={column.name || `column-${idx}`}>
                    <Typography variant="subtitle2">{column.name}</Typography>
                    {column.type && (
                      <Typography variant="caption" color="text.secondary">
                        {column.type}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`${rowIndex}-${column.name || colIndex}`}>
                      {row[column.name] !== null && row[column.name] !== undefined 
                        ? String(row[column.name]) 
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    );
  };

  return (
    <>
      {renderDatabaseInfo()}
      {renderTableData()}
    </>
  );
};

export default DatabaseTab;

