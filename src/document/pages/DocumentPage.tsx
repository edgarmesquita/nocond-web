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

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
    });

type DocumentParams = {
    type: string
}

type DocumentPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps<DocumentParams>;


const DocumentPage = ({ classes, ...props }: DocumentPageProps) => {
    const name = props.match.params.type == 'notices' ? 'Editais' : 'Atas';
    return (
        <AppLayout {...props}>
            <AppBreadcrumbs items={[
                { name: 'Documentos', path: `/documents/${props.match.params.type}`, icon: 'description' },
                { name: name, path: `/documents/${props.match.params.type}` }
            ]} {...props} />
        </AppLayout>
    );
}

export default withStyles(styles)(DocumentPage);