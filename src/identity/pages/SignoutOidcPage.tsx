import React, { useEffect } from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import { RouteComponentProps } from "react-router-dom";
import "../../assets/css/stretch.css";
import { CircularProgress, Typography } from "@material-ui/core";
import { signoutRedirectCallback } from "../services/UserService";
import { CenteredPaper } from "../../shared/components";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({

    });

type SignoutOidcPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const SignoutOidcPage = ({ classes, history }: SignoutOidcPageProps) => {

    useEffect(() => {
        async function signoutAsync() {
            await signoutRedirectCallback()
            history.push('/')
        }
        signoutAsync()
    }, [history])
    return (
        <CenteredPaper>
            <Typography gutterBottom variant="h6">Redirecionando...</Typography>
            <CircularProgress />
        </CenteredPaper>
    );
}

export default withStyles(styles)(SignoutOidcPage);