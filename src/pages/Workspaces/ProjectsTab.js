// pages/Workspaces/ProjectsTab.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid
} from '@mui/material';
import { useTranslation } from "react-i18next";
import AssignmentIcon from '@mui/icons-material/Assignment';

const ProjectsTab = ({ workspace }) => {
  const { t } = useTranslation();
  const projects = workspace.projects || [];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <AssignmentIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.projects", "Projects")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${projects.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {projects.length > 0 ? (
        <List>
          {projects.map((project, index) => (
            <ListItem key={index} divider={index < projects.length - 1}>
              <ListItemText 
                primary={project.name || t("viewWorkspacePage.untitled", "Untitled Project")}
                secondary={
                  <>
                    {project.description && <span>{project.description}<br /></span>}
                    {project.status && (
                      <Chip 
                        label={project.status} 
                        size="small" 
                        color={project.status === 'open' ? 'primary' : 'default'} 
                        sx={{ mr: 1, mt: 1 }} 
                      />
                    )}
                    {project.dueDate && (
                      <Chip 
                        label={`Due: ${new Date(project.dueDate).toLocaleDateString()}`} 
                        size="small" 
                        sx={{ mt: 1 }} 
                      />
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            {t("viewWorkspacePage.noProjects", "No projects found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ProjectsTab;

