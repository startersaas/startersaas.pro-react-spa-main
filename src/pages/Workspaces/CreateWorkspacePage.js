// pages/Workspaces/CreateWorkspacePage.jsx
import { CreateWorkspace } from "api/mutations";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import ConfirmAlert from "libs/confirmAlert";
import WorkspaceForm from "./WorkspaceForm";
import {
  Grid,
  Typography,
  Paper,
  Container
} from '@mui/material';

const CreateWorkspacePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createWorkspaceMutate = useMutation(CreateWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries(["Workspaces", user.accountId]);
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await createWorkspaceMutate.mutateAsync(data);
      if (response) {
        ConfirmAlert.success(t("createWorkspacePage.workspaceCreated", "Workspace created successfully"));
        navigate("/workspaces");
      }
    } catch (error) {
      if (error.response?.data) {
        ConfirmAlert.error(error.response.data);
      }
    }
  };

  const newWorkspaceDefaults = {
    name: "",
    description: "",
    isPublic: false,
    mysqlHost: "",
    mysqlPort: 3306,
    mysqlUser: "",
    mysqlPassword: "",
    mysqlDatabase: "",
    mysqlTable: "",
    mysqlConnectionType: "direct"
  };

  return (
    <Container>
      <Typography component="h1" variant="h5" gutterBottom>
        {t("createWorkspacePage.createWorkspace", "Create Workspace")}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container>
          <Grid item xs={12}>
            <WorkspaceForm 
              workspace={newWorkspaceDefaults} 
              onSubmit={onSubmit} 
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateWorkspacePage;

