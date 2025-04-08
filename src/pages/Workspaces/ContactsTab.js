// pages/Workspaces/ContactsTab.jsx
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
import ContactsIcon from '@mui/icons-material/Contacts';

const ContactsTab = ({ workspace }) => {
  const { t } = useTranslation();
  const contacts = workspace.contacts || [];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <ContactsIcon />
            </Grid>
            <Grid item>
              {t("viewWorkspacePage.contacts", "Contacts")}
            </Grid>
            <Grid item>
              <Chip 
                label={`${contacts.length}`} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Typography>
      </Box>
      
      <Divider />
      
      {contacts.length > 0 ? (
        <List>
          {contacts.map((contact, index) => (
            <ListItem key={index} divider={index < contacts.length - 1}>
              <ListItemAvatar>
                <Avatar>
                  {contact.name ? contact.name[0].toUpperCase() : 'C'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={contact.name || t("viewWorkspacePage.unnamed", "Unnamed")}
                secondary={
                  <>
                    {contact.company && <span>{contact.company}<br /></span>}
                    {contact.email && <span>{contact.email}<br /></span>}
                    {contact.phone && <span>{contact.phone}<br /></span>}
                    {contact.status && <span>{contact.status}</span>}
                    {contact.tags && contact.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {contact.tags.map((tag, i) => (
                          <Chip key={i} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </Box>
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
            {t("viewWorkspacePage.noContacts", "No contacts found")}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ContactsTab;

