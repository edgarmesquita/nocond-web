import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { DataType } from "../../shared/components/AppTable";
import { OwnerType, OwnerTypeRequest } from "../../models";
import CrudPage from "../../shared/pages/CrudPage";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        search: {
            margin: "15px 10px 10px 10px",
            textAlign: "right"
        },
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    });

type OwnerTypePageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const OwnerTypePage = ({ classes, ...props }: OwnerTypePageProps) => {

    const [name, setName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');

    return CrudPage<OwnerTypeRequest, OwnerType>({
        breadcrumbs: [
            { name: 'Pessoas', icon: 'people' },
            { name: 'Tipos de Proprietários', path: '/configurations/owner-types' }
        ],
        title: 'Tipos de Proprietários', dataSource: '/v1/owner-types', columnKey: 'id',
        columns: [
            { id: 'name', label: 'Nome', type: DataType.String, sortable: true, filterable: true },
            { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
        ],
        requestFields: [
            {
                name: 'name', label: 'Nome', helperText: 'Nome do tipo de proprietário',
                type: DataType.String, validators: ['required'], errorMessages: ['O nome do tipo de proprietário é obrigatório'],
                getValue: () => name, setValue: () => setName
            },
            {
                name: 'description', label: 'Descrição', helperText: 'Descrição do tipo de proprietário',
                type: DataType.String,
                getValue: () => description, setValue: () => setDescription
            }
        ],
        getRequest: () => { return { name, description } }, ...props
    });
}

export default withStyles(styles)(OwnerTypePage)