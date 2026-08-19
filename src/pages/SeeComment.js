import { Button } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import SeeCommentPost from "./SeeCommentPost"
export default function SeeDetail({open, handleClose, scroll, title, description}) {

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);

    return(
        <div>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Bình luận</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>

                <SeeCommentPost />

            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Ẩn</Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}