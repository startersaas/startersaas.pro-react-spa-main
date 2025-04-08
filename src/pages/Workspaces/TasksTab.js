// pages/Workspaces/TasksTab.jsx
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
import TaskIcon from '@mui/icons-material/Task';

const TasksTab = ({ workspace }) => {
  const { t } = useTranslation();
  const tasks = workspace.tasks || [];
  
  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch(status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <TaskIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.tasks", "Tasks")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${tasks.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {tasks.length > 0 ? (
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} divider={index < tasks.length - 1}>
              <ListItemText 
                primary={task.title || t("viewWorkspacePage.untitledTask", "Untitled Task")}
                secondary={
                  <>
                    {task.description && <span>{task.description}<br /></span>}
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {task.status && (
                        <Chip 
                          label={task.status} 
                          size="small" 
                          color={getStatusColor(task.status)} 
                        />
                      )}
                      {task.dueDate && (
                        <Chip 
                          label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`} 
                          size="small" 
                          variant="outlined" 
                          color={new Date(task.dueDate) < new Date() ? 'error' : 'default'}
                        />
                      )}
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            {t("viewWorkspacePage.noTasks", "No tasks found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TasksTab;