import React, { ReactNode } from "react";
import { ValidatorForm } from 'react-material-ui-form-validator';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { AppBar, Button, CircularProgress, Dialog, IconButton, Slide, Toolbar, Typography } from "@material-ui/core";
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        loading: {
            marginRight: '8px'
        },
        form: {
            display: 'contents'
        }
    });

type AppModalProps = {
    title: string,
    open: boolean,
    fullScreen: boolean,
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false,
    onClose: () => void,
    onSubmit?: (e: React.FormEvent<Element>) => void,
    children?: ReactNode,
    saving?: boolean,
    contentClassName?: string
} & WithStyles<typeof styles>;

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const AppModal = ({ classes, children, title, onClose, onSubmit, open, fullScreen, maxWidth, saving, contentClassName }: AppModalProps) => {

    const getContent = () => {
        return (<React.Fragment>
            {fullScreen ? (
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        <Button type={onSubmit ? 'submit' : 'button'} autoFocus color="inherit" onClick={onSubmit ? undefined : onClose}>
                            Salvar
                        </Button>
                    </Toolbar>
                </AppBar>
            ) : (
                    <DialogTitle id="customized-dialog-title" onClose={onClose}>
                        {title}
                    </DialogTitle>
                )}
            <DialogContent dividers className={contentClassName}>
                {children}
            </DialogContent>
            {!fullScreen && (
                <DialogActions>
                    <Button type={onSubmit ? 'submit' : 'button'} autoFocus onClick={onSubmit ? undefined : onClose}
                        color="primary" disabled={saving}>
                        {saving ? (
                            <React.Fragment>
                                <CircularProgress size={16} className={classes.loading} />{' Salvando...'}
                            </React.Fragment>
                        ) : 'Salvar'}
                    </Button>
                </DialogActions>
            )}
        </React.Fragment>)
    }
    return (
        <Dialog fullScreen={fullScreen} onClose={onClose} maxWidth={maxWidth} fullWidth={maxWidth ? true : false}
            aria-labelledby="customized-dialog-title"
            open={open} disableBackdropClick={true}
            TransitionComponent={Transition}>

            {onSubmit ? <ValidatorForm onSubmit={onSubmit} className={classes.form}>{getContent()}</ValidatorForm> : getContent()}
        </Dialog>
    );
}

export default withStyles(styles)(AppModal);