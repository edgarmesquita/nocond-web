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
import { UnitType, UnitTypeRequest } from "../models";
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
    });


type UnitTypePageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const UnitTypePage = ({ classes, ...props }: UnitTypePageProps) => {

    const [name, setName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');

    return CrudPage<UnitTypeRequest, UnitType>({
        breadcrumbs: [
            { name: 'Condomínios', icon: 'apartment' },
            { name: 'Tipos de Unidades', path: '/unit-types', icon: 'list' }
        ],
        title: 'Tipos de Unidades', dataSource: '/v1/unit-types', columnKey: 'id',
        columns: [
            { id: 'name', label: 'Nome', type: DataType.String, sortable: true, filterable: true },
            { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
        ],
        requestFields: [
            {
                name: 'name', label: 'Nome', helperText: 'Nome do tipo de unidade',
                type: DataType.String, validators: ['required'], errorMessages: ['O nome do tipo de unidade é obrigatório'],
                getValue: () => name, setValue: () => setName
            },
            {
                name: 'description', label: 'Descrição', helperText: 'Descrição do tipo de unidade',
                type: DataType.String,
                getValue: () => description, setValue: () => setDescription
            }
        ],
        getRequest: () => { return { name, description } }, ...props
    });
}

export default withStyles(styles)(UnitTypePage);