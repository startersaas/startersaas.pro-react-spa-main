// pages/Workspaces/MembersTab.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Grid
} from '@mui/material';
import { useTranslation } from "react-i18next";
import PeopleIcon from '@mui/icons-material/People';

const MembersTab = ({ workspace }) => {
  const { t } = useTranslation();
  const members = workspace.members || [];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <PeopleIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.members", "Members")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${members.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {members.length > 0 ? (
        <List>
          {members.map((member, index) => (
            <ListItem key={index} divider={index < members.length - 1}>
              <ListItemAvatar>
                <Avatar>
                  {member.name ? member.name[0].toUpperCase() : 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={member.name || t("viewWorkspacePage.unnamed", "Unnamed")}
                secondary={
                  <>
                    {member.email && <span>{member.email}<br /></span>}
                    <span>{t(`viewWorkspacePage.role.${member.role || 'user'}`, member.role || 'User')}</span>
                    {member.joinedAt && (
                      <span> · {t("viewWorkspacePage.joined", "Joined")} {new Date(member.joinedAt).toLocaleDateString()}</span>
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
            {t("viewWorkspacePage.noMembers", "No members found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MembersTab;

