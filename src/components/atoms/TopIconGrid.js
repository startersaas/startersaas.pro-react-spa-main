import React, { Fragment } from 'react';
import { IconButton, Typography, Box, Chip } from '@mui/material';

// Import icons
import GppGoodIcon from '@mui/icons-material/GppGood';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCardIcon from '@mui/icons-material/AddCard';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import ApiIcon from '@mui/icons-material/Api';
import WebhookIcon from '@mui/icons-material/Webhook';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CodeIcon from '@mui/icons-material/Code';
import TemplateIcon from '@mui/icons-material/AutoAwesome';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import ExploreIcon from '@mui/icons-material/Explore';
import FeaturesIcon from '@mui/icons-material/Home';

// Default menu items based on Footer paths - added visible boolean flag
const routerMenuItems = [
  { icon: FeaturesIcon, text: 'Features', color: '#3F51B5', path: '/features-page', visible: true },
  { icon: GppGoodIcon, text: 'Getting Started', color: '#FF6B6B', path: '/getting-started', visible: true },
  { icon: AddCardIcon, text: 'Add Card', color: '#4ECDC4', path: '/add-card', visible: true },
  { icon: LoginIcon, text: 'Login', color: '#45B7D1', path: '/login-page', visible: true },
  { icon: DashboardIcon, text: 'Overview', color: '#96CEB4', path: '/overview', visible: true },
  { icon: VisibilityIcon, text: 'Overview Alt', color: '#96CEB4', path: '/overview-alt', visible: true },
  { icon: GroupsIcon, text: 'Subscribers', color: '#FFEEAD', path: '/subscribers', visible: true },
  { icon: ManageAccountsIcon, text: 'Admin', color: '#D4A5A5', path: '/admin', visible: true },
  { icon: ExploreIcon, text: 'Discover', color: '#9B59B6', path: '/discover-more', visible: true },
  { icon: EditIcon, text: 'Subscriptions', color: '#FFD93D', path: '/subscriptions', visible: true },
  { icon: DashboardIcon, text: 'Dashboard', color: '#6C5B7B', path: '/dashboard-page', visible: true },
  { icon: GroupIcon, text: 'Routing', color: '#FF6B6B', path: '/routing-libraries', visible: true },
  { icon: AssignmentIcon, text: 'Plans', color: '#4ECDC4', path: '/plans', visible: true },
  { icon: WebhookIcon, text: 'Webhooks Usage', color: '#45B7D1', path: '/webhooks-usage', visible: true },
  { icon: AccountCircleIcon, text: 'Users', color: '#96CEB4', path: '/users-page', visible: true },
  { icon: GroupsIcon, text: 'Teams', color: '#FFEEAD', path: '/teams-page', visible: true },
  { icon: AlternateEmailIcon, text: 'Callbacks', color: '#D4A5A5', path: '/callbacks', visible: true },
  { icon: CreditCardIcon, text: 'Stripe', color: '#9B59B6', path: '/stripe-sessions', visible: true },
  { icon: TemplateIcon, text: 'Templates', color: '#FFD93D', path: '/templates', visible: true },
  { icon: ApiIcon, text: 'API Endpoints', color: '#3F51B5', path: '/api-endpoints', visible: true },
  { icon: CodeIcon, text: 'Experimental APIs', color: '#673AB7', path: '/experimental-apis', visible: true },
  { icon: WebhookIcon, text: 'Webhooks', color: '#6C5B7B', path: '/webhooks', visible: true },
  { icon: CreditCardIcon, text: 'Cards', color: '#FF6B6B', path: '/cards', visible: true },
  { icon: PaymentIcon, text: 'Payments', color: '#4ECDC4', path: '/payments', visible: true },
  { icon: AccessTimeIcon, text: 'Trials', color: '#45B7D1', path: '/trials', visible: true },
  { icon: IntegrationInstructionsIcon, text: 'Integrations', color: '#96CEB4', path: '/integrations', visible: true }
];

const TopIconGrid = ({ 
  items = routerMenuItems, 
  onItemClick,
  useTheme = true,
  color = "primary.main",
  iconFontSize = null,
  background = "rgba(255, 255, 255, 0.05)",
  borderRadius = "50%",
  padding = 0,
  margin = "0.5rem",
  useWrapper = false,
  wrapperSx = {},
  useChips = true
}) => {
  // Function to render individual items
  const renderItems = () => (
    items.filter(item => item.visible).map((item, index) => (
      useChips ? (
        <Chip
          key={index}
          icon={<item.icon sx={{ 
            color: useTheme ? item.color : color,
            ...(iconFontSize && { fontSize: iconFontSize })
          }} />}
          label={item.text}
          onClick={() => onItemClick && onItemClick(item.path)}
          variant="outlined"
          size="small"
        />
      ) : (
        <Box
          key={index}
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            m: margin
          }}
        >
          <IconButton
            onClick={() => onItemClick && onItemClick(item.path)}
            sx={{
              background,
              borderRadius,
              padding,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <item.icon 
              sx={{ 
                color: useTheme ? item.color : color,
                ...(iconFontSize && { fontSize: iconFontSize })
              }} 
            />
          </IconButton>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 500,
              display: 'block',
              mt: 0.5
            }}
          >
            {item.text}
          </Typography>
        </Box>
      )
    ))
  );

  // Return either with wrapper or just the items
  return useWrapper ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        ...wrapperSx
      }}
    >
      {renderItems()}
    </Box>
  ) : (
    <Fragment>
      {renderItems()}
    </Fragment>
  );
};

export default TopIconGrid;