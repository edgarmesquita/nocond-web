import React, { ReactNode, useState } from "react";
import axios, { AxiosError } from 'axios';
import {
    createStyles,
    Theme,
} from "@material-ui/core/styles";
import { isMobile } from 'react-device-detect';
import { RouteComponentProps } from "react-router-dom";
import { AppBreadcrumbs, AppLayout, AppTable, ISelectOption } from "../components";
import { IRoute } from "../components/AppBreadcrumbs";
import { DataType, IColumn } from "../components/AppTable";
import { Fab, makeStyles, Snackbar } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { maskArray } from "react-text-mask";
import Alert from "@material-ui/lab/Alert";
import FormModal, { IRequestField } from "../components/FormModal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        fab: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        }
    }),
);

type CrudPageProps<TRequest, TResult> = {
    hasReferenced?: boolean,
    referenceId?: string | null,
    title?: string,
    breadcrumbs: IRoute[],
    columnKey: keyof TResult,
    dataSource?: string | null,
    columns: IColumn<TResult>[],
    requestFields: IRequestField<TRequest>[],
    getRequest: () => TRequest,
    adaptRequest?: (result: TResult) => TRequest,
    onButtonAddRender?: (onClick: () => void) => JSX.Element,
    children?: ReactNode,
    error?: AxiosError | null,
    snackbarOpen?: boolean,
    tableKey?: string | number | null,

} & RouteComponentProps;

export default function CrudPage<TRequest, TResult>({
    title, breadcrumbs, columnKey, dataSource, columns, children,
    requestFields, getRequest, adaptRequest,
    onButtonAddRender, ...props
}: CrudPageProps<TRequest, TResult>) {
    const classes = useStyles();
    const baseUrl = process.env.REACT_APP_API_URL;
    const [open, setOpen] = useState<boolean>(false);
    const [tableKey, setTableKey] = useState<number | string | null>(props.tableKey || Math.random());
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [error, setError] = useState<AxiosError | null | undefined>(props.error);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(props.snackbarOpen === true);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
        setError(err);
        setSnackbarOpen(true);
    }

    const getItem = async (id: string): Promise<TResult | null> => {
        try {
            const response = await axios.get<TResult>(`${baseUrl}${dataSource}/${id}`);
            return response.data;
        }
        catch (err) {
            return null;
        }
    }
    const handleEdit = async (id: string) => {
        const item: any = await getItem(id);

        if (item) {
            setCurrentId(id);

            const request = adaptRequest ? adaptRequest(item) : item;
            requestFields.forEach(field => {

                if (field.setValue)
                    field.setValue()(request[field.name] || '')
            });

            setOpen(true);
        }
    }

    return (
        <AppLayout {...props}>
            <AppBreadcrumbs items={breadcrumbs} {...props} gutterBottom />
            {dataSource && (
                <AppTable tableKey={tableKey} title={title} dataSource={dataSource}
                    columnKey={columnKey} columns={columns} onEdit={handleEdit} editable />
            )}
            {children}
            {dataSource && (
                <React.Fragment>
                    {onButtonAddRender ? onButtonAddRender(handleClickOpen) : (
                        <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClickOpen}>
                            <AddIcon />
                        </Fab>
                    )}

                    <FormModal currentId={currentId} open={open} dataSource={dataSource} title={title || 'Formulário'}
                        onSave={handleSave} onError={handleError} onClose={handleClose}
                        requestFields={requestFields} getRequest={getRequest} />

                </React.Fragment>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={10000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {error?.response?.data.errors && Object.keys(error.response.data.errors).map(errorKey => (
                        <p key={errorKey}>{Array.isArray(error.response?.data.errors[errorKey]) ? (
                            error.response?.data.errors[errorKey].map((err: string) => (
                                <span>{err}</span>
                            ))
                        ) : error?.response?.data.errors[errorKey]}</p>
                    ))}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
}