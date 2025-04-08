// pages/Workspaces/InfoTab.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  Grid,
  Box
} from '@mui/material';
import { useTranslation } from "react-i18next";

const InfoTab = ({ workspace }) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t("viewWorkspacePage.details", "Workspace Details")}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.name", "Name")}
          </Typography>
          <Typography>{workspace.name}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.slug", "Slug")}
          </Typography>
          <Typography>{workspace.slug || "-"}</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.description", "Description")}
          </Typography>
          <Typography>
            {workspace.description || "-"}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.timezone", "Timezone")}
          </Typography>
          <Typography>{workspace.timezone || "UTC"}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.publicVisibility", "Public Visibility")}
          </Typography>
          <Typography>
            {workspace.isPublic 
              ? t("viewWorkspacePage.public", "Public") 
              : t("viewWorkspacePage.private", "Private")}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.created", "Created")}
          </Typography>
          <Typography>
            {workspace.createdAt ? new Date(workspace.createdAt).toLocaleString() : "-"}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.lastAccessed", "Last Accessed")}
          </Typography>
          <Typography>
            {workspace.lastAccessed ? new Date(workspace.lastAccessed).toLocaleString() : "-"}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {t("viewWorkspacePage.id", "Workspace ID")}
          </Typography>
          <Typography fontFamily="monospace">
            {workspace.id}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InfoTab;

