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
import { MeetingType, MeetingTypeRequest } from "../models";
import CrudPage from "../../shared/pages/CrudPage";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
    });

type MeetingTypePageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;


const MeetingTypePage = ({ classes, ...props }: MeetingTypePageProps) => {

    const [name, setName] = React.useState<string>('');

    return CrudPage<MeetingTypeRequest, MeetingType>({
        breadcrumbs: [
            { name: 'Assenbléias', icon: 'local_library' },
            { name: 'Tipos de Assembléias', path: '/meeting-types' }
        ],
        title: 'Tipos de Assembléias', dataSource: '/v1/meeting-types', columnKey: 'id',
        columns: [
            { id: 'name', label: 'Nome', type: DataType.String, sortable: true },
            { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
        ],
        requestFields: [
            {
                name: 'name', label: 'Nome', helperText: 'Nome do tipo da assembléia',
                type: DataType.String, validators: ['required'], errorMessages: ['O nome do tipo da assembléia é obrigatório'],
                getValue: () => name, setValue: () => setName
            }
        ],
        getRequest: () => { return { name } }, ...props
    });
}

export default withStyles(styles)(MeetingTypePage);