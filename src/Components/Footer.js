import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{pb:3}}>
      {'Copyright © '}
      <Link color="inherit" href="#"> InCase we need a link
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
 
export default function Footer() { 
  return(
  <Box sx={{ bgcolor: 'background.paper', p: 2, height: '5rem' }}>
    <Typography variant="h6" align="center" gutterBottom>
      Footer
    </Typography>
    <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
      Whatever Footer Content we want to add!
    </Typography>
    <Copyright/>
  </Box>
  );
}