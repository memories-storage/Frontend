import React from 'react';
import { Box, Paper, Typography, Button, Select, MenuItem, Stack, Divider } from '@mui/material';

const Settings = () => {
  const [theme, setTheme] = React.useState('light');
  const [language, setLanguage] = React.useState('en');

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, mb: 4, p: 3, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="primary.dark">Settings</Typography>
        </Paper>

        <Stack spacing={4}>
          {/* Account Settings */}
          <Paper elevation={1} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>Account Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
                  <Typography variant="body2" color="text.secondary">Manage your notification preferences</Typography>
                </Box>
                <Button variant="outlined">Configure</Button>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Privacy</Typography>
                  <Typography variant="body2" color="text.secondary">Control your privacy settings</Typography>
                </Box>
                <Button variant="outlined">Manage</Button>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Security</Typography>
                  <Typography variant="body2" color="text.secondary">Two-factor authentication and security settings</Typography>
                </Box>
                <Button variant="outlined">Setup</Button>
              </Stack>
            </Stack>
          </Paper>

          {/* App Settings */}
          <Paper elevation={1} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>App Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Theme</Typography>
                  <Typography variant="body2" color="text.secondary">Choose your preferred theme</Typography>
                </Box>
                <Select
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Language</Typography>
                  <Typography variant="body2" color="text.secondary">Select your preferred language</Typography>
                </Box>
                <Select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </Stack>
            </Stack>
          </Paper>

          {/* Data & Storage */}
          <Paper elevation={1} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>Data & Storage</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Export Data</Typography>
                  <Typography variant="body2" color="text.secondary">Download your data</Typography>
                </Box>
                <Button variant="outlined">Export</Button>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>Clear Cache</Typography>
                  <Typography variant="body2" color="text.secondary">Clear cached data to free up space</Typography>
                </Box>
                <Button variant="outlined">Clear</Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default Settings; 