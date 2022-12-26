import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import { RouteComponentProps } from "react-router-dom";
import { AppBreadcrumbs, AppLayout } from "../../shared/components";
import { useApiService } from "../../config/axios.config";
import { UnitGroup } from "../models";
import { CircularProgress, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        loading: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: "240px",
            flexGrow: 1,
        },
    });

interface CouncilPageParam {
    unitGroupId: string;
}
type CouncilPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps<CouncilPageParam>;

const CouncilPage = ({ classes, ...props }: CouncilPageProps) => {
    const [unitGroup, unitGroupError] = useApiService<UnitGroup>(`/v1/unit-groups/${props.match.params.unitGroupId}`);
    return (
        <AppLayout {...props}>
            <AppBreadcrumbs items={[
                { name: 'Condomínios', icon: 'apartment', path: '/unit-groups' },
                { name: 'Lista de Conselhos', path: `/unit-groups/${props.match.params.unitGroupId}/councils`, icon: 'list' }
            ]} {...props} />

            {unitGroup && (<Typography variant="h6">{unitGroup.name} - Conselhos</Typography>)}

            {unitGroup == null && unitGroupError == null && (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            )}
            {unitGroupError && (
                <Alert severity="error">{unitGroupError.message}</Alert>
            )}
        </AppLayout>
    );
}

export default withStyles(styles)(CouncilPage);