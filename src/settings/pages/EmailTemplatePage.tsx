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
import { EmailTemplate, EmailTemplateRequest } from "../../models";
import CrudPage from "../../shared/pages/CrudPage";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    });

type EmailTemplatePageProps = {

} & WithStyles<typeof styles> & RouteComponentProps;

const EmailTemplatePage = ({ classes, ...props }: EmailTemplatePageProps) => {

    const [name, setName] = React.useState<string>('');
    const [code, setCode] = React.useState<string>('');

    return CrudPage<EmailTemplateRequest, EmailTemplate>({
        breadcrumbs: [
            { name: 'Configurações', icon: 'settings' },
            { name: 'Templates de E-mails', icon: 'email', path: '/configurations/email-templates' }
        ],
        title: 'Template de E-mails', dataSource: '/v1/emails/templates', columnKey: 'id',
        columns: [
            { id: 'name', label: 'Nome', type: DataType.String, sortable: true, filterable: true },
            { id: 'code', label: 'Código de Referência', type: DataType.String, sortable: true, filterable: true },
            { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
        ],
        requestFields: [
            {
                name: 'name', label: 'Nome', helperText: 'Nome do template',
                type: DataType.String, validators: ['required'], errorMessages: ['O nome do template é obrigatório'],
                getValue: () => name, setValue: () => setName, sm: 6
            },
            {
                name: 'code', label: 'Código de Referência', helperText: 'Código correspondente ao template no SendGrid',
                type: DataType.String, validators: ['required'], errorMessages: ['O código de referência é obrigatório'],
                getValue: () => code, setValue: () => setCode, sm: 6
            }
        ],
        getRequest: () => { return { name, code } }, ...props
    });
}

export default withStyles(styles)(EmailTemplatePage);