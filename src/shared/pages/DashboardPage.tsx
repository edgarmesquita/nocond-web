import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import { RouteComponentProps } from "react-router-dom";
import { AppBreadcrumbs, AppLayout } from "../components";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
    });

type DashboardPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const DashboardPage = ({ classes, ...props }: DashboardPageProps) => {

    return (
        <AppLayout {...props}>
            <AppBreadcrumbs items={[{ name: 'Dashboard', path: '/dashboard', icon: 'dashboard' }]} {...props} />
        </AppLayout>
    );
}

export default withStyles(styles)(DashboardPage);