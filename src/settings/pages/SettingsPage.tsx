import React, { ReactNode, useEffect } from "react";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { AppLayout } from "../../shared/components";
import { RouteComponentProps } from "react-router-dom";
import { Button, Card, CardActions, CardContent, Grid, MenuItem, Typography } from "@material-ui/core";
import { useApiService } from "../../config/axios.config";
import { EmailTemplate, MeetingSettings, PagedListResult } from "../../models";
import { MeetingSettingsService } from "../services/MeetingSettingsService";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        cardActions: {
            justifyContent: "flex-end"
        }
    });

type SettingsPageProps = { children?: ReactNode } & WithStyles<typeof styles> & RouteComponentProps;

const SettingsPage = ({ classes, children, ...props }: SettingsPageProps) => {

    const [templates, error] = useApiService<PagedListResult<EmailTemplate>>('/v1/emails/templates?pageIndex=1&pageSize=100');
    const [meetingSettings, meetingSettingsError] = useApiService<MeetingSettings>('/v1/settings/meetings');
    const [creationEmailTemplateId, setCreationEmailTemplateId] = React.useState<string>('');
    const [beforeNotificationEmailTemplateId, setBeforeNotificationEmailTemplateId] = React.useState<string>('');

    const handleCreationEmailTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreationEmailTemplateId(event.target.value);
    };

    const handleBeforeNotificationEmailTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBeforeNotificationEmailTemplateId(event.target.value);
    };

    const handleSubmit = (e: React.FormEvent<Element>) => {

        const service = new MeetingSettingsService();
        service.update({
            beforeNotificationEmailTemplateId: beforeNotificationEmailTemplateId || null,
            creationEmailTemplateId: creationEmailTemplateId || null
        }).then((result) => {

        })

    }
    useEffect(() => {
        if (meetingSettings != null) {
            setCreationEmailTemplateId(meetingSettings.creationEmailTemplate?.id || '');
            setBeforeNotificationEmailTemplateId(meetingSettings.beforeNotificationEmailTemplate?.id || '');
        }
    }, [meetingSettings])
    return (
        <AppLayout {...props}>

            <Typography variant="h5" component="h2" gutterBottom>Assembléias</Typography>

            <Card>
                <ValidatorForm onSubmit={handleSubmit}>
                    <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>Templates de Emails</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextValidator fullWidth
                                    id="creationEmailTemplateId"
                                    name="creationEmailTemplateId"
                                    validators={['required']}
                                    errorMessages={['Selecione um template']}
                                    select disabled={templates == null}
                                    label="Selecione um template"
                                    value={creationEmailTemplateId}
                                    onChange={handleCreationEmailTemplateChange}
                                    helperText="Este template corresponde a um e-mail convite"
                                    variant="outlined">
                                    {templates ? templates.items.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    )) : <MenuItem></MenuItem>}
                                </TextValidator>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextValidator fullWidth
                                    name="beforeNotificationEmailTemplateId"
                                    id="beforeNotificationEmailTemplateId"
                                    validators={['required']}
                                    errorMessages={['Selecione um template']}
                                    select disabled={templates == null}
                                    label="Selecione um template"
                                    value={beforeNotificationEmailTemplateId}
                                    onChange={handleBeforeNotificationEmailTemplateChange}
                                    helperText="Este template corresponde a um e-mail de notificação prévia"
                                    variant="outlined">
                                    {templates ? templates.items.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    )) : <MenuItem></MenuItem>}
                                </TextValidator>
                            </Grid>

                        </Grid>


                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                    </CardActions>
                </ValidatorForm>
            </Card>
        </AppLayout>
    );
}

export default withStyles(styles)(SettingsPage);