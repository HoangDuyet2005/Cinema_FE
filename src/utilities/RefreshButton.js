import { Button } from '@material-ui/core';
import * as React from 'react';
import CachedIcon from "@material-ui/icons/Cached";

export default function CircularIntegration() {
  return (
    <Button color="primary"  variant="contained" startIcon={<CachedIcon />}>
        Refresh
    </Button>
  );
}