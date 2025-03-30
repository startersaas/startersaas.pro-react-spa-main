import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import VisitorCounter from 'components/electrons/VisitorCounter';

const Footer = ({ 
  display = true, 
  paddingY = 0, 
  paddingX = 0, 
  backgroundColor = 'transparent',
  innerBackgroundColor = 'transparent',
  color = 'primary.main',
  fontWeight = 400
}) => {
  const navigate = useNavigate();

  const navigatePage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigateOpen = (path) => {
    if (path.startsWith('http')) {
      navigatePage(path);
    } else {
      navigate(path);
    }
  };

  if (!display) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        py: paddingY,
        backgroundColor
      }}
    >
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
          },
          paddingX,
          backgroundColor: innerBackgroundColor
        }}
      >
        <Grid container spacing={1}>
          {/* Column 1 */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant="caption" sx={{ color, fontWeight }}>Public Pages</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('/')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Home" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/home-page')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Home Page" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/hello-world')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Hello World" 
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant="caption" sx={{ color, fontWeight }}>Authentication</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('/auth/login')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Login" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/auth/register')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Register" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/auth/forgot-password')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Forgot Password" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/auth/resend-activation')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Resend Activation" 
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Reset Password" 
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Activate Account" 
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant="caption" sx={{ color, fontWeight }}>User Management</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('/users')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="All Users" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/create-user')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Create User" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/user/edit')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Edit User" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/account/edit')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Edit Account" 
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Edit User ID" 
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="User Detail" 
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Column 4 */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant="caption" sx={{ color, fontWeight }}>Team Management</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('/teams')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="All Teams" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/user-teams')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="My Teams" 
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Team Detail" 
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Column 5 */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant="caption" sx={{ color, fontWeight }}>Dashboard</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('/dashboard')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Dashboard Home" 
                />
              </ListItemButton>
            </List>

            <Typography variant="caption" sx={{ color, fontWeight }}>Billing & Plans</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('/card/add')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Add Payment Card" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('/plan')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Select Plan" 
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Subscribe Plan" 
                />
              </ListItemButton>
            </List>
          </Grid>

          {/* Column 6 */}
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Typography variant="caption" sx={{ color, fontWeight }}>GitHub Repositories</Typography>
            <List dense disablePadding>
              <ListItemButton onClick={() => navigateOpen('https://github.com/startersaas/startersaas-backend-go-api-main.git')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Go API Backend" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('https://github.com/startersaas/startersaas-backend-node-api-main.git')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="Node API Backend" 
                />
              </ListItemButton>
              <ListItemButton onClick={() => navigateOpen('https://github.com/startersaas/startersaas-frontend-react-spa.git')}>
                <ListItemText 
                  primaryTypographyProps={{ 
                    variant: 'caption',
                    color,
                    fontWeight
                  }} 
                  primary="React Frontend" 
                />
              </ListItemButton>
            </List>
          </Grid>
          
          {/* Visitor Counter Row - Full Width */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <VisitorCounter display={true} height={125} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;