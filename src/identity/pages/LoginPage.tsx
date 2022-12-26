import React, { useEffect, useState } from "react";
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
import { CenteredPaper } from "../../shared/components";
import { signinRedirect } from "../services/UserService";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({

    });

type LoginPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const LoginPage = ({ classes, history }: LoginPageProps) => {
    const [error, setError] = useState(null);
    useEffect(() => {
        async function signinAsync() {
            try {
                await signinRedirect();
            }
            catch (err) {
                setError(err);
            }
        }
        signinAsync()
    }, [])

    return (
        <CenteredPaper>
            {error ? (
                <React.Fragment>
                    <Typography gutterBottom variant="h6">Não foi possível redirecionar</Typography>
                    <Typography gutterBottom variant="body1">A página de login está temporariamente indisponível. Por favor tente mais tarde.</Typography>
                </React.Fragment>
            ) : (
                    <React.Fragment>
                        <Typography gutterBottom variant="h6">Redirecionando...</Typography>
                        <CircularProgress />
                    </React.Fragment>
                )}

        </CenteredPaper>
    );
}

export default withStyles(styles)(LoginPage);