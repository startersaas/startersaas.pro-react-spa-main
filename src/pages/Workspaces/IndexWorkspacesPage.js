// pages/Workspaces/IndexWorkspacesPage.jsx
import { DeleteWorkspace } from "api/mutations";
import { Workspaces } from "api/queries";
import Loader from "components/atoms/Loader";
import ConfirmAlert from "libs/confirmAlert";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useAuth } from 'contexts/AuthContext';
import QueryDebugLogger from 'components/debugging/QueryDebugLogger';
import Storage from "libs/storage";
import { SUPER_JWT_TOKEN, JWT_TOKEN } from "config";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Container
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

const IndexWorkspacesPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [deleteWorkspacePopup, setDeleteWorkspacePopup] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(undefined);
  const [showDebugger, setShowDebugger] = useState(false); // Set to true to show debug panel
  const [tokenInfo, setTokenInfo] = useState({});
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const queryClient = useQueryClient();

  const deleteWorkspaceMutate = useMutation(DeleteWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Workspaces", user.accountId]);
    },
  });

  const { isLoading, data, error } = useQuery(["Workspaces", user.accountId], Workspaces, {
    retry: false,
  });

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

  const handleViewClick = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  const deleteWorkspace = async () => {
    try {
      await deleteWorkspaceMutate.mutateAsync(workspaceId);
      ConfirmAlert.success(t("indexWorkspacesPage.workspaceDeleted", "Workspace deleted"));
    } catch (error) {
      if (error.response?.data) {
        ConfirmAlert.error(error.response.data);
      }
    }
  };

  if (isLoading) return <Loader />;
  
  const renderDeleteWorkspaceDialog = () => (
    <Dialog open={deleteWorkspacePopup} onClose={() => setDeleteWorkspacePopup(false)}>
      <DialogContent>
        <Typography align="center">
          {t("indexWorkspacesPage.deleteWorkspace", "Delete this workspace?")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDeleteWorkspacePopup(false);
            deleteWorkspace();
            setWorkspaceId("");
          }}
          color="error"
        >
          {t("indexWorkspacesPage.yes", "Yes")}
        </Button>
        <Button
          onClick={() => {
            setDeleteWorkspacePopup(false);
            setWorkspaceId("");
          }}
        >
          {t("indexWorkspacesPage.no", "No")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderWorkspacesTable = () => (
    <TableContainer component={Paper}>
      <Table>
        {/* Desktop header - hidden on mobile */}
        <TableHead sx={{ display: { xs: 'none', md: 'table-header-group' } }}>
          <TableRow>
            <TableCell>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <StorageIcon color="action" sx={{ fontSize: 20 }} />
                </Grid>
                <Grid item>{t("indexWorkspacesPage.name", "Name")}</Grid>
              </Grid>
            </TableCell>
            <TableCell>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <DescriptionIcon color="action" sx={{ fontSize: 20 }} />
                </Grid>
                <Grid item>{t("indexWorkspacesPage.description", "Description")}</Grid>
              </Grid>
            </TableCell>
            <TableCell>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <CalendarTodayIcon color="action" sx={{ fontSize: 20 }} />
                </Grid>
                <Grid item>{t("indexWorkspacesPage.lastAccessed", "Last Accessed")}</Grid>
              </Grid>
            </TableCell>
            <TableCell>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <VisibilityIcon color="action" sx={{ fontSize: 20 }} />
                </Grid>
                <Grid item>{t("indexWorkspacesPage.actions", "Actions")}</Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.map((workspace, i) => (
            <>
              {/* Mobile view (xs, sm) */}
              <TableRow 
                key={`mobile-${workspace.id}-${i}`}
                sx={{ 
                  display: { xs: 'grid', md: 'none' },
                  gridTemplateColumns: '1fr',
                  gap: 1,
                  '& > td': {
                    border: 0,
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 0.5,
                    padding: 1
                  }
                }}
              >
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <StorageIcon color="action" sx={{ fontSize: 20 }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="caption" color="text.secondary">
                        {t("indexWorkspacesPage.name", "Name")}
                      </Typography>
                      <Typography>{workspace.name}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <DescriptionIcon color="action" sx={{ fontSize: 20 }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="caption" color="text.secondary">
                        {t("indexWorkspacesPage.description", "Description")}
                      </Typography>
                      <Typography>{workspace.description || "-"}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <CalendarTodayIcon color="action" sx={{ fontSize: 20 }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="caption" color="text.secondary">
                        {t("indexWorkspacesPage.lastAccessed", "Last Accessed")}
                      </Typography>
                      <Typography>
                        {workspace.lastAccessed 
                          ? new Date(workspace.lastAccessed).toLocaleDateString() 
                          : "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell sx={{ mt: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Button
                        component={Link}
                        to={`/workspaces/view/${workspace.id}`}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleViewClick(workspace)}
                      >
                        {t("buttonWorkspaces.view", "View")}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        component={Link}
                        to={`/workspaces/edit/${workspace.id}`}
                        fullWidth
                        variant="outlined"
                      >
                        {t("buttonWorkspaces.edit", "Edit")}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        onClick={() => {
                          setDeleteWorkspacePopup(true);
                          setWorkspaceId(workspace.id);
                        }}
                        fullWidth
                        variant="outlined"
                        color="error"
                      >
                        {t("buttonWorkspaces.delete", "Delete")}
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>

              {/* Desktop view (md and up) */}
              <TableRow 
                key={`desktop-${workspace.id}-${i}`}
                sx={{ display: { xs: 'none', md: 'table-row' } }}
              >
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <StorageIcon color="action" sx={{ fontSize: 20 }} />
                    </Grid>
                    <Grid item>{workspace.name}</Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <DescriptionIcon color="action" sx={{ fontSize: 20 }} />
                    </Grid>
                    <Grid item>{workspace.description || "-"}</Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <CalendarTodayIcon color="action" sx={{ fontSize: 20 }} />
                    </Grid>
                    <Grid item>
                      {workspace.lastAccessed 
                        ? new Date(workspace.lastAccessed).toLocaleDateString() 
                        : "-"}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        component={Link}
                        to={`/workspaces/view/${workspace.id}`}
                        variant="outlined"
                        onClick={() => handleViewClick(workspace)}
                      >
                        {t("buttonWorkspaces.view", "View")}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        component={Link}
                        to={`/workspaces/edit/${workspace.id}`}
                        variant="outlined"
                      >
                        {t("buttonWorkspaces.edit", "Edit")}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => {
                          setDeleteWorkspacePopup(true);
                          setWorkspaceId(workspace.id);
                        }}
                        variant="outlined"
                        color="error"
                      >
                        {t("buttonWorkspaces.delete", "Delete")}
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Set up queries for the debug logger
  const debugQueries = [
    {
      name: 'Authentication Tokens',
      isLoading: false,
      isError: false,
      data: tokenInfo
    },
    {
      name: 'Workspaces',
      isLoading,
      isError: !!error,
      error,
      data
    },
    {
      name: 'Selected Workspace',
      isLoading: false,
      isError: false,
      data: selectedWorkspace
    }
  ];

  return (
    <Container>
      <Typography component="h1" variant="h5" gutterBottom>
        {t("indexWorkspacesPage.workspaces", "Workspaces")}
      </Typography>

      <Paper>
        <Grid container justifyContent="space-between" padding={2}>
          <Grid item>
            <Button 
              onClick={() => setShowDebugger(!showDebugger)} 
              variant="outlined"
              color="info"
            >
              {showDebugger ? "Hide Debug" : "Show Debug"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/workspaces/create"
              variant="contained"
            >
              {t("buttonWorkspaces.createWorkspace", "Create Workspace")}
            </Button>
          </Grid>
        </Grid>

        {data?.data.length > 0 ? (
          renderWorkspacesTable()
        ) : (
          <Typography align="center" p={4}>
            {t("indexWorkspacesPage.noWorkspaces", "No workspaces found")}
          </Typography>
        )}
      </Paper>

      {renderDeleteWorkspaceDialog()}
      
      {/* Debug Logger */}
      <QueryDebugLogger queries={debugQueries} isVisible={showDebugger} />
    </Container>
  );
};

export default IndexWorkspacesPage;