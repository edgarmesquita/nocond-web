import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { RouteComponentProps } from "react-router-dom";
import {
    emphasize,
    withStyles,
    Theme,
} from "@material-ui/core/styles";

import { Breadcrumbs, Chip, createStyles, Icon, StyleRules, WithStyles } from '@material-ui/core';

const StyledBreadcrumb = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[300],
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[300], 0.12),
        },
    },
}))(Chip) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            marginBottom: "20px",
        },
    });

export interface IRoute {
    icon?: string;
    path?: string;
    name: string;
}

type AppBreadcrumbsProps = {
    items: IRoute[],
    gutterBottom?: boolean,
    children?: ReactNode
} & WithStyles<typeof styles> & RouteComponentProps;

const AppBreadcrumbs = ({ history, items, gutterBottom, classes }: AppBreadcrumbsProps) => {

    const handleClick = (path: string) => (event: React.MouseEvent<Element, MouseEvent>) => {
        event.preventDefault();
        history.push(path)
    }

    return (
        <Breadcrumbs aria-label="breadcrumb" className={clsx({ [classes.root]: gutterBottom })}>
            {items.map((item: IRoute, idx: number) =>
                <StyledBreadcrumb key={idx}
                    component="a" href="#"
                    label={item.name}
                    icon={item.icon ? <Icon fontSize="small">{item.icon}</Icon> : undefined}
                    onClick={item.path ? handleClick(item.path) : undefined} />)}

        </Breadcrumbs>
    );
}
export default withStyles(styles)(AppBreadcrumbs);