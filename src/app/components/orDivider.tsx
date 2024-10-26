"use client";
import { Button, Divider, Link, styled } from "@mui/material";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export default function OrDivider() {
  return (
    <Root>
      <Divider>or</Divider>
    </Root>
  );
}
