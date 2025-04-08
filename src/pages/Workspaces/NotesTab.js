// pages/Workspaces/NotesTab.jsx
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
import NoteIcon from '@mui/icons-material/Note';

const NotesTab = ({ workspace }) => {
  const { t } = useTranslation();
  const notes = workspace.notes || [];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <NoteIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.notes", "Notes")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${notes.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {notes.length > 0 ? (
        <List>
          {notes.map((note, index) => (
            <ListItem key={index} divider={index < notes.length - 1}>
              <ListItemText 
                primary={
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">
                      {note.noteId ? `Note #${note.noteId.toString().substring(0, 6)}...` : 'Note'}
                    </Typography>
                    {note.createdAt && (
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(note.createdAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                      {note.content || t("viewWorkspacePage.noContent", "No content")}
                    </Typography>
                    {note.linkedTo && note.linkedTo.type && (
                      <Chip 
                        label={`Linked to: ${note.linkedTo.type}`} 
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
            {t("viewWorkspacePage.noNotes", "No notes found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default NotesTab;

