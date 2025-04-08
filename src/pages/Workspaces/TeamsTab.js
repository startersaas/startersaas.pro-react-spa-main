// pages/Workspaces/TeamsTab.jsx
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
import GroupWorkIcon from '@mui/icons-material/GroupWork';

const TeamsTab = ({ workspace }) => {
  const { t } = useTranslation();
  const teams = workspace.teams || [];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <GroupWorkIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.teams", "Teams")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${teams.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {teams.length > 0 ? (
        <List>
          {teams.map((team, index) => (
            <ListItem key={index} divider={index < teams.length - 1}>
              <ListItemText 
                primary={team.name || t("viewWorkspacePage.untitledTeam", "Untitled Team")}
                secondary={
                  <>
                    {team.code && <span>Code: {team.code}</span>}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            {t("viewWorkspacePage.noTeams", "No teams found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TeamsTab;

