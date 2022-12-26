import React, { useState } from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { RouteComponentProps } from "react-router-dom";

import { AppBreadcrumbs, AppLayout, ISelectOption } from "../../shared/components";
import { CircularProgress, Fab, Grid, Snackbar, TablePagination, Typography } from "@material-ui/core";
import { useApiService } from "../../config/axios.config";
import { PagedListResult } from "../../models";

import AddIcon from '@material-ui/icons/Add';
import { isMobile } from 'react-device-detect';
import { MeetingCard } from "..";
import { useSelector } from "react-redux";
import { getUnitGroup } from "../../store/unit/actions";
import { UnitGroup } from "../../unit/models";
import FormModal, { InputType, IRequestField, IRequestFieldWithOptions } from "../../shared/components/FormModal";
import { AxiosError } from "axios";
import { Meeting, MeetingRequest, MeetingType } from "../models";
import { DataType } from "../../shared/components/AppTable";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    });

interface MeetingPageParam {
    unitGroupId?: string;
}
type MeetingPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps<MeetingPageParam>;

const MeetingPage = ({ classes, ...props }: MeetingPageProps) => {
    const storedUnitGroup = useSelector(getUnitGroup);
    const unitGroupId = props.match.params.unitGroupId || storedUnitGroup?.id;
    const [unitGroup, unitGroupError] = useApiService<UnitGroup>(unitGroupId ? `/v1/unit-groups/${unitGroupId}` : null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [open, setOpen] = useState(false);

    const [tableKey, setTableKey] = useState<number>(Math.random());
    const dataSource = unitGroupId ? `/v1/unit-groups/${unitGroupId}/meetings` : null;
    const [response, error] = useApiService<PagedListResult<Meeting>>(unitGroupId ? `${dataSource}?pageIndex=${page + 1}&pageSize=${rowsPerPage}` : null, tableKey);
    const [currentId, setCurrentId] = useState<string | null>(null);

    const [formError, setFormError] = useState<AxiosError | null | undefined>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startsOn, setStartsOn] = useState<Date>(new Date());
    const [endsOn, setEndsOn] = useState<Date>(new Date());
    const [meetingTypeId, setMeetingTypeId] = useState<string>('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        handleClose();
        setTableKey(Math.random());
    }

    const handleError = (err: AxiosError) => {
        setFormError(err);
        setSnackbarOpen(true);
    }

    const requestFields: IRequestField<MeetingRequest>[] = [
        {
            name: 'meetingTypeId', label: 'Tipo de Assembléia', helperText: 'Tipo de Assembléia',
            type: DataType.String, inputType: InputType.Select, xs: 12,
            getValue: () => meetingTypeId, setValue: () => setMeetingTypeId, dataSource: '/v1/meeting-types',
            adaptResponse: (meetingType: MeetingType): ISelectOption | null | undefined => {
                return { value: meetingType.id, text: meetingType.name };
            }
        } as IRequestFieldWithOptions<MeetingRequest, MeetingType>,
        {
            name: 'startsOn', label: 'Inicia em', helperText: 'Data de início da Assembléia',
            type: DataType.Date, inputType: InputType.DateTime, xs: 6,
            validators: ['required'], errorMessages: ['A data de início da Assembléia é obrigatória.'],
            getValue: () => startsOn, setValue: () => setStartsOn
        },
        {
            name: 'endsOn', label: 'Termina em', helperText: 'Data de término da Assembléia',
            type: DataType.Date, inputType: InputType.DateTime, xs: 6,
            validators: ['required'], errorMessages: ['A data de término da Assembléia é obrigatória.'],
            getValue: () => endsOn, setValue: () => setEndsOn
        },
        {
            name: 'name', label: 'Nome', helperText: 'Título da Assembléia',
            type: DataType.String, validators: ['required'], errorMessages: ['O nome é obrigatório'],
            getValue: () => name, setValue: () => setName
        },
        {
            name: 'description', label: 'Descrição', helperText: 'Descrição da Assembléia',
            type: DataType.String, validators: [], errorMessages: [],
            getValue: () => description, setValue: () => setDescription
        },

    ];

    const getRequest = (): MeetingRequest => {
        return {
            name, description, startsOn, endsOn, meetingTypeId, unitGroupId: unitGroupId || ''
        }
    }
    return (
        <AppLayout {...props}>
            <AppBreadcrumbs gutterBottom items={[
                { name: 'Assembléias', icon: 'local_library' },
                { name: 'Lista de Assembléias', path: '/meetings' }
            ]} {...props} />

            {unitGroup && (
                <Typography variant="h6" gutterBottom>{unitGroup.name} - Assembléias</Typography>
            )}
            {!unitGroupId && (
                <React.Fragment>
                    <Typography variant="h6" gutterBottom>Lista de Unidades</Typography>
                    <Alert severity="warning">{"Selecione um condomínio"}</Alert>
                </React.Fragment>
            )}

            {((response == null && error == null) || (unitGroupId && unitGroup == null && unitGroupError == null)) && (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            )}
            {error && (
                <Alert severity="error">{error.message}</Alert>
            )}
            {response && (
                <React.Fragment>
                    <Grid container spacing={2}>
                        {response?.items.map((item: Meeting, index) => {

                            return (
                                <Grid item key={item.id} xs={12} md={4} lg={3}>
                                    <MeetingCard item={item} {...props} />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <TablePagination
                        rowsPerPageOptions={[12, 24, 36]}
                        component="div"
                        count={response?.totalCount || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </React.Fragment>
            )}
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClickOpen}>
                <AddIcon />
            </Fab>
            <FormModal currentId={currentId} open={open} dataSource={dataSource} title={'Formulário'}
                onSave={handleSave} onError={handleError} onClose={handleClose}
                requestFields={requestFields} getRequest={getRequest} />

            <Snackbar open={snackbarOpen} autoHideDuration={10000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {formError?.response?.data.errors && Object.keys(formError.response.data.errors).map(errorKey => (
                        <p key={errorKey}>{Array.isArray(formError.response?.data.errors[errorKey]) ? (
                            formError.response?.data.errors[errorKey].map((err: string) => (
                                <span>{err}</span>
                            ))
                        ) : formError?.response?.data.errors[errorKey]}</p>
                    ))}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
}

export default withStyles(styles)(MeetingPage);