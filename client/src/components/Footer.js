import { Box, Typography } from "@mui/material"

function Footer() {
  return (
    <Box component="footer" sx={{ width: '100%', textAlign: "center", py: 3, bgcolor: "grey.100", color: "text.primary" }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Travel Mate
      </Typography>
    </Box>
  );
}

export default Footer;
