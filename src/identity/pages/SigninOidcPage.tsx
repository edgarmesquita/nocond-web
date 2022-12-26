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
import { signinRedirectCallback } from "../services/UserService";
import { CenteredPaper } from "../../shared/components";
import { setStoreUser } from "../../store/user/actions";
import { useDispatch } from "react-redux";
import { IUser } from "../../store/user/types";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({

    });

type SigninOidcPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const SigninOidcPage = ({ classes, history }: SigninOidcPageProps) => {
    const dispatch = useDispatch();
    useEffect(() => {
        async function signinAsync() {
            var user = await signinRedirectCallback();
            dispatch(setStoreUser({
                access_token: user.access_token,
                expires_at: user.expires_at,
                id_token: user.id_token,
                profile: {
                    name: user.profile?.name,
                    preferred_username: user.profile?.preferred_username,
                    sub: user.profile?.sub
                }
            }));
            history.push('/')
        }
        signinAsync()
    }, [dispatch, history])
    return (
        <CenteredPaper>
            <Typography gutterBottom variant="h6">Redirecionando...</Typography>
            <CircularProgress />
        </CenteredPaper>
    );
}

export default withStyles(styles)(SigninOidcPage);