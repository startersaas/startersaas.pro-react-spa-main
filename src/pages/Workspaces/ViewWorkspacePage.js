// pages/Workspaces/ViewWorkspacePage.jsx
import { Workspace, WorkspaceTableData, TestDatabaseConnection } from "api/queries";
import Loader from "components/atoms/Loader";
import ConfirmAlert from "libs/confirmAlert";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import QueryDebugLogger from 'components/debugging/QueryDebugLogger';
import Storage from "libs/storage";
import { JWT_TOKEN, SUPER_JWT_TOKEN } from "config";
import {
  Button,
  Typography,
  Grid,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert
} from '@mui/material';

// Tab icons
import StorageIcon from '@mui/icons-material/Storage';
import DatabaseIcon from '@mui/icons-material/Dns';
import PeopleIcon from '@mui/icons-material/People';
import ContactsIcon from '@mui/icons-material/Contacts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import TaskIcon from '@mui/icons-material/Task';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import InfoIcon from '@mui/icons-material/Info';
import BugReportIcon from '@mui/icons-material/BugReport';

// Tab components
import InfoTab from './InfoTab';
import DatabaseTab from './DatabaseTab';
import MembersTab from './MembersTab';
import ContactsTab from './ContactsTab';
import ProjectsTab from './ProjectsTab';
import MeetingsTab from './MeetingsTab';
import NotesTab from './NotesTab';
import TasksTab from './TasksTab';
import TeamsTab from './TeamsTab';

const ViewWorkspacePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadData, setLoadData] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showDebugger, setShowDebugger] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({});
  const [routeInfo, setRouteInfo] = useState({});

  // Get token and route information for debugging
  useEffect(() => {
    const jwtToken = Storage.getItem(JWT_TOKEN);
    const superToken = Storage.getItem(SUPER_JWT_TOKEN);
    
    setTokenInfo({
      hasJwtToken: !!jwtToken,
      jwtTokenFirstChars: jwtToken ? jwtToken.substring(0, 10) + '...' : 'None',
      hasSuperToken: !!superToken,
      superTokenFirstChars: superToken ? superToken.substring(0, 10) + '...' : 'None',
    });
    
    setRouteInfo({
      id: id,
      pathname: location.pathname,
      search: location.search,
      isIdUndefined: id === 'undefined' || id === undefined,
      idType: typeof id
    });
  }, [id, location]);

  const { 
    isLoading, 
    isError,
    error,
    data: workspaceData,
    refetch
  } = useQuery(
    ["Workspace", id],
    () => Workspace(id),
    { 
      retry: false,
      enabled: !!id && id !== 'undefined', // Only run query if id is valid
      onError: (err) => {
        // We'll see this in the debug logger
      }
    }
  );

  const {
    isLoading: isLoadingTableData,
    data: tableData,
    error: tableError,
    refetch: refetchTableData
  } = useQuery(
    ["WorkspaceTableData", id, rowsPerPage],
    () => WorkspaceTableData(id, rowsPerPage),
    { 
      enabled: loadData && !!id && id !== 'undefined',
      retry: false
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLoadData = async () => {
    setLoadData(true);
    try {
      // First test the connection
      await TestDatabaseConnection(id);
      // Then load the data
      refetchTableData();
    } catch (error) {
      ConfirmAlert.error(
        error.response?.data?.message || 
        "Failed to connect to database. Please check connection details."
      );
      setLoadData(false);
    }
  };

  // Create queries array for debug logger
  const debugQueries = [
    {
      name: 'Authentication Tokens',
      isLoading: false,
      isError: false,
      data: tokenInfo
    },
    {
      name: 'Route Information',
      isLoading: false,
      isError: false,
      data: routeInfo
    },
    {
      name: 'Workspace Data',
      isLoading,
      isError,
      error,
      data: workspaceData
    },
    ...(loadData ? [{
      name: 'Table Data',
      isLoading: isLoadingTableData,
      isError: !!tableError,
      error: tableError,
      data: tableData
    }] : [])
  ];

  // Show loading state
  if (isLoading) return (
    <Container>
      <Loader />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Loading workspace {id}...
      </Typography>
      
      {/* Even during loading, show the debug logger */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={() => setShowDebugger(!showDebugger)}
          variant="outlined"
          color="info"
        >
          {showDebugger ? 'Hide Debug Info' : 'Show Debug Info'}
        </Button>
      </Box>
      
      <QueryDebugLogger queries={debugQueries} isVisible={showDebugger} />
    </Container>
  );

  // Handle error or missing ID in URL
  if (isError || !id || id === 'undefined' || !workspaceData?.data) {
    return (
      <Container>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Workspace
          </Typography>
          
          {!id || id === 'undefined' ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid workspace ID: {id || 'undefined'}
            </Alert>
          ) : isError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.message || 'Failed to load workspace'}
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No workspace data found for ID: {id}
            </Alert>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Button
              component={Link}
              to="/workspaces"
              variant="contained"
              color="primary"
            >
              Return to Workspaces List
            </Button>
            <Button
              sx={{ ml: 2 }}
              onClick={() => setShowDebugger(!showDebugger)}
              variant="outlined"
            >
              {showDebugger ? 'Hide Debugger' : 'Show Debugger'}
            </Button>
            <Button
              sx={{ ml: 2 }}
              onClick={() => refetch()}
              variant="outlined"
              color="secondary"
            >
              Retry Loading
            </Button>
          </Box>
        </Paper>
        
        <QueryDebugLogger queries={debugQueries} isVisible={showDebugger} />
      </Container>
    );
  }

  const workspace = workspaceData?.data;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography component="h1" variant="h5">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <StorageIcon />
            </Grid>
            <Grid item>
              {workspace.name}
            </Grid>
          </Grid>
        </Typography>
        
        <Box>
          <Button 
            onClick={() => setShowDebugger(!showDebugger)}
            variant="outlined"
            color="info"
            sx={{ mr: 1 }}
          >
            <BugReportIcon sx={{ mr: 0.5 }} />
            {showDebugger ? 'Hide Debug' : 'Show Debug'}
          </Button>
          <Button 
            component={Link} 
            to={`/workspaces/edit/${id}`} 
            variant="outlined"
            sx={{ mr: 1 }}
          >
            {t("viewWorkspacePage.edit", "Edit")}
          </Button>
          <Button 
            component={Link} 
            to="/workspaces" 
            variant="outlined"
          >
            {t("viewWorkspacePage.back", "Back")}
          </Button>
        </Box>
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<InfoIcon />} label={t("viewWorkspacePage.info", "Info")} />
        <Tab icon={<DatabaseIcon />} label={t("viewWorkspacePage.database", "Database")} />
        <Tab icon={<PeopleIcon />} label={t("viewWorkspacePage.members", "Members")} />
        <Tab icon={<ContactsIcon />} label={t("viewWorkspacePage.contacts", "Contacts")} />
        <Tab icon={<AssignmentIcon />} label={t("viewWorkspacePage.projects", "Projects")} />
        <Tab icon={<EventIcon />} label={t("viewWorkspacePage.meetings", "Meetings")} />
        <Tab icon={<NoteIcon />} label={t("viewWorkspacePage.notes", "Notes")} />
        <Tab icon={<TaskIcon />} label={t("viewWorkspacePage.tasks", "Tasks")} />
        <Tab icon={<GroupWorkIcon />} label={t("viewWorkspacePage.teams", "Teams")} />
      </Tabs>
      
      {activeTab === 0 && <InfoTab workspace={workspace} />}
      
      {activeTab === 1 && (
        <DatabaseTab 
          workspace={workspace}
          isLoadingTableData={isLoadingTableData}
          handleLoadData={handleLoadData}
          loadData={loadData}
          tableData={tableData}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      
      {activeTab === 2 && <MembersTab workspace={workspace} />}
      {activeTab === 3 && <ContactsTab workspace={workspace} />}
      {activeTab === 4 && <ProjectsTab workspace={workspace} />}
      {activeTab === 5 && <MeetingsTab workspace={workspace} />}
      {activeTab === 6 && <NotesTab workspace={workspace} />}
      {activeTab === 7 && <TasksTab workspace={workspace} />}
      {activeTab === 8 && <TeamsTab workspace={workspace} />}
      
      {/* Debug Logger */}
      <QueryDebugLogger queries={debugQueries} isVisible={showDebugger} />
    </Container>
  );
};

export default ViewWorkspacePage;