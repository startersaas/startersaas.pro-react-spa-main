// pages/Workspaces/EditWorkspacePage.jsx
import { UpdateWorkspace } from "api/mutations";
import { Workspace } from "api/queries";
import Loader from "components/atoms/Loader";
import ConfirmAlert from "libs/confirmAlert";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import WorkspaceForm from "./WorkspaceForm";
import QueryDebugLogger from 'components/debugging/QueryDebugLogger';
import Storage from "libs/storage";
import { JWT_TOKEN, SUPER_JWT_TOKEN } from "config";
import {
  Grid,
  Typography,
  Paper,
  Container,
  Box,
  Button,
  Alert
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

const EditWorkspacePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showDebugger, setShowDebugger] = useState(true);
  const [tokenInfo, setTokenInfo] = useState({});

  // Get token information
  useEffect(() => {
    const jwtToken = Storage.getItem(JWT_TOKEN);
    const superToken = Storage.getItem(SUPER_JWT_TOKEN);
    
    setTokenInfo({
      hasJwtToken: !!jwtToken,
      jwtTokenFirstChars: jwtToken ? jwtToken.substring(0, 10) + '...' : 'None',
      hasSuperToken: !!superToken,
      superTokenFirstChars: superToken ? superToken.substring(0, 10) + '...' : 'None',
    });
  }, []);

  const { 
    isLoading, 
    isError,
    error,
    data: workspaceData
  } = useQuery(
    ["Workspace", id],
    () => Workspace(id),
    { 
      retry: false,
      enabled: !!id && id !== 'undefined'
    }
  );

  const updateWorkspaceMutate = useMutation(
    (data) => UpdateWorkspace(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["Workspaces", user.accountId]);
        queryClient.invalidateQueries(["Workspace", id]);
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      const response = await updateWorkspaceMutate.mutateAsync(data);
      if (response) {
        ConfirmAlert.success(t("editWorkspacePage.workspaceUpdated", "Workspace updated successfully"));
        navigate("/workspaces");
      }
    } catch (error) {
      if (error.response?.data) {
        ConfirmAlert.error(error.response?.data?.message || "Error updating workspace");
      }
    }
  };

  // Set up queries for the debug logger
  const debugQueries = [
    {
      name: 'Authentication Tokens',
      isLoading: false,
      isError: false,
      data: tokenInfo
    },
    {
      name: 'Workspace Data',
      isLoading,
      isError,
      error,
      data: workspaceData
    },
    {
      name: 'Update Mutation',
      isLoading: updateWorkspaceMutate.isLoading,
      isError: updateWorkspaceMutate.isError,
      error: updateWorkspaceMutate.error,
      data: updateWorkspaceMutate.data
    }
  ];

  if (isLoading) return (
    <Container>
      <Loader />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Loading workspace {id}...
      </Typography>
      
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
              onClick={() => navigate("/workspaces")}
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
          </Box>
        </Paper>
        
        <QueryDebugLogger queries={debugQueries} isVisible={showDebugger} />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography component="h1" variant="h5">
          {t("editWorkspacePage.editWorkspace", "Edit Workspace")}
        </Typography>
        
        <Button 
          onClick={() => setShowDebugger(!showDebugger)}
          variant="outlined"
          color="info"
        >
          <BugReportIcon sx={{ mr: 0.5 }} />
          {showDebugger ? 'Hide Debug' : 'Show Debug'}
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Grid container>
          <Grid item xs={12}>
            <WorkspaceForm 
              workspace={workspaceData?.data} 
              onSubmit={onSubmit} 
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Debug Logger */}
      <QueryDebugLogger queries={debugQueries} isVisible={showDebugger} />
    </Container>
  );
};

export default EditWorkspacePage;