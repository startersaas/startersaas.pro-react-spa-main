// pages/Workspaces/WorkspaceForm.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  InputAdornment,
  MenuItem,
  Divider,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import LanguageIcon from '@mui/icons-material/Language';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import DatabaseIcon from '@mui/icons-material/Dns';
import TableChartIcon from '@mui/icons-material/TableChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const WorkspaceForm = ({ workspace, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(workspace || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {t("workspaceForm.basicInfo", "Basic Information")}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("workspaceForm.name", "Workspace Name")}
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StorageIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("workspaceForm.slug", "Slug")}
            name="slug"
            value={formData.slug || ""}
            onChange={handleChange}
            helperText={t("workspaceForm.slugHelp", "URL-friendly name (auto-generated if empty)")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("workspaceForm.timezone", "Timezone")}
            name="timezone"
            value={formData.timezone || "UTC"}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("workspaceForm.description", "Description")}
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublic || false}
                onChange={handleChange}
                name="isPublic"
                color="primary"
              />
            }
            label={t("workspaceForm.public", "Public workspace")}
          />
        </Grid>

        {/* Advanced fields (database settings) in accordion */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {t("workspaceForm.databaseConnection", "Database Connection")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("workspaceForm.mysqlHost", "MySQL Host")}
                    name="mysqlHost"
                    value={formData.mysqlHost || ""}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("workspaceForm.mysqlPort", "MySQL Port")}
                    name="mysqlPort"
                    type="number"
                    value={formData.mysqlPort || 3306}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("workspaceForm.mysqlUser", "MySQL User")}
                    name="mysqlUser"
                    value={formData.mysqlUser || ""}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("workspaceForm.mysqlPassword", "MySQL Password")}
                    name="mysqlPassword"
                    type="password"
                    value={formData.mysqlPassword || ""}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("workspaceForm.mysqlDatabase", "MySQL Database")}
                    name="mysqlDatabase"
                    value={formData.mysqlDatabase || ""}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DatabaseIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("workspaceForm.mysqlTable", "MySQL Table")}
                    name="mysqlTable"
                    value={formData.mysqlTable || ""}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TableChartIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label={t("workspaceForm.mysqlConnectionType", "Connection Type")}
                    name="mysqlConnectionType"
                    value={formData.mysqlConnectionType || "direct"}
                    onChange={handleChange}
                  >
                    <MenuItem value="direct">
                      {t("workspaceForm.direct", "Direct")}
                    </MenuItem>
                    <MenuItem value="ssh">
                      {t("workspaceForm.ssh", "SSH Tunnel")}
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {t("workspaceForm.save", "Save")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default WorkspaceForm;