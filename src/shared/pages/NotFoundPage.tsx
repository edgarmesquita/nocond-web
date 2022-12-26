import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import { Link, RouteComponentProps } from "react-router-dom";
import { AppLayout } from "../components";
import { Typography } from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
    });

type NotFoundPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const NotFoundPage = ({ classes, ...props }: NotFoundPageProps) => {

    return (
        <AppLayout {...props}>

            <Typography variant="h2">Página não encontrada</Typography>
            <Typography variant="body1">Não encontramos a página que você tentou acessar.</Typography>
            <Typography variant="body1"><Link to="/">Ir para a página inicial</Link></Typography>
        </AppLayout>
    );
}

export default withStyles(styles)(NotFoundPage);