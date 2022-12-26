import React from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { IconButton, Tooltip } from "@material-ui/core";
import { DataType } from "../../shared/components/AppTable";
import { UnitGroup, UnitGroupRequest } from "../models";
import CrudPage from "../../shared/pages/CrudPage";
import ApartmentIcon from '@material-ui/icons/Apartment';
import GroupIcon from '@material-ui/icons/Group';

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        search: {
            margin: "15px 10px 10px 10px",
            textAlign: "right"
        }
    });


type UnitGroupPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const UnitGroupPage = ({ classes, ...props }: UnitGroupPageProps) => {

    const [name, setName] = React.useState<string>('');

    const handleUnitClick = (data: UnitGroup) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    }

    const handleCouncilClick = (data: UnitGroup) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        props.history.push(`/unit-groups/${data.id}/councils`);
    }
    return CrudPage<UnitGroupRequest, UnitGroup>({
        breadcrumbs: [
            { name: 'Condomínios', icon: 'apartment' },
            { name: 'Lista de Condomínios', icon: 'list', path: '/configurations/unit-groups' }
        ],
        title: 'Condomínios', dataSource: '/v1/unit-groups', columnKey: 'id',
        columns: [
            { id: 'name', label: 'Nome', type: DataType.String, sortable: true, filterable: true },
            { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
            {
                onCellRender: (data: UnitGroup) => (
                    <Tooltip title="Unidades">
                        <IconButton size="small" color="primary" aria-label="Unidades" onClick={handleUnitClick(data)}>
                            <ApartmentIcon />
                        </IconButton>
                    </Tooltip>
                ), width: 64
            },
            {
                onCellRender: (data: UnitGroup) => (
                    <Tooltip title="Conselhos">
                        <IconButton size="small" color="primary" aria-label="Conselhos" onClick={handleCouncilClick(data)}>
                            <GroupIcon />
                        </IconButton>
                    </Tooltip>
                ), width: 64
            }
        ],
        requestFields: [
            {
                name: 'name', label: 'Nome', helperText: 'Nome do condomínio',
                type: DataType.String, validators: ['required'], errorMessages: ['O nome do condomínio é obrigatório'],
                getValue: () => name, setValue: () => setName
            }
        ],
        getRequest: () => { return { name } }, ...props
    });
}

export default withStyles(styles)(UnitGroupPage);