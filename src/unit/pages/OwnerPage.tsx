import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import { RouteComponentProps } from "react-router-dom";
import { DataType, IColumn } from "../../shared/components/AppTable";
import { IRoute } from "../../shared/components";
import { CrudPage } from "../../shared";
import { IRequestField } from "../../shared/components/FormModal";
import { Owner, OwnerRequest } from "../models";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
    });

type OwnerPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const OwnerPage = ({ classes, ...props }: OwnerPageProps) => {

    const [name, setName] = React.useState<string>('');

    const breadcrumbs: IRoute[] = [
        { name: 'Pessoas', icon: 'people' },
        { name: 'Lista de Pessoas', path: '/owners' }
    ];

    const columns: IColumn<Owner>[] = [
        { id: 'name', label: 'Nome', type: DataType.String, sortable: true, filterable: true },
        { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
    ];

    const requestFields: IRequestField<OwnerRequest>[] = [
        {
            name: 'name', label: 'Nome', helperText: '',
            type: DataType.String, validators: ['required'], errorMessages: ['O nome ou razão social é obrigatório'],
            getValue: () => name, setValue: () => setName
        },
    ];

    const getRequest = (): OwnerRequest => {
        return {
            name
        }
    }
    return (
        <CrudPage breadcrumbs={breadcrumbs}
            title='Lista de Pessoas' dataSource='/v1/owners' columnKey='id'
            columns={columns}
            requestFields={requestFields}
            getRequest={getRequest} {...props} />
    );
}

export default withStyles(styles)(OwnerPage);