// pages/Workspaces/MeetingsTab.jsx
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
import EventIcon from '@mui/icons-material/Event';

const MeetingsTab = ({ workspace }) => {
  const { t } = useTranslation();
  const meetings = workspace.meetings || [];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <EventIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.meetings", "Meetings")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${meetings.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {meetings.length > 0 ? (
        <List>
          {meetings.map((meeting, index) => (
            <ListItem key={index} divider={index < meetings.length - 1}>
              <ListItemText 
                primary={meeting.title || t("viewWorkspacePage.untitledMeeting", "Untitled Meeting")}
                secondary={
                  <>
                    {meeting.description && <span>{meeting.description}<br /></span>}
                    {meeting.location && <span>Location: {meeting.location}<br /></span>}
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {meeting.type && (
                        <Chip 
                          label={meeting.type} 
                          size="small" 
                          color="primary" 
                        />
                      )}
                      {meeting.start && (
                        <Chip 
                          label={`${new Date(meeting.start).toLocaleString()}`} 
                          size="small" 
                          variant="outlined" 
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
            {t("viewWorkspacePage.noMeetings", "No meetings found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MeetingsTab;

