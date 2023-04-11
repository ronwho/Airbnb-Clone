import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
export default function Footer() {
  return (
    <Paper
      sx={{
        mt: 2,
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: "#3b3535"
      }}
      component="footer"
      square
      variant="outlined"
    >
      <Container
        maxWidth="md"
        sx={{
          mt: 2,
          mb: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.primary"
          align="center"
          sx={{ mt: 2, color: "white"}}
        >
          {"Restify, Inc. "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Paper>
  );
}
