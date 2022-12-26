import React, { ReactNode, useEffect, useState } from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { AxiosError } from "axios";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({

    });

type ErrorSnackbarProps = {
    autoHideDuration?: number | null,
    error?: AxiosError,
    children?: ReactNode
} & WithStyles<typeof styles>;

const ErrorSnackbar = ({ classes, children, error, autoHideDuration }: ErrorSnackbarProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(error !== undefined);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        setSnackbarOpen(error !== undefined);
    }, [error]);

    return (
        <Snackbar open={snackbarOpen} autoHideDuration={autoHideDuration} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="error">
                {error?.response?.data.errors.map((e: any) => <p key={e}>{e}</p>)}
            </Alert>
        </Snackbar>
    );
}

export default withStyles(styles)(ErrorSnackbar);