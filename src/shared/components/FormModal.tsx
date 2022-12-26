import React, { ReactNode, useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import { isMobile } from 'react-device-detect';
import { maskArray } from "react-text-mask";
import AppSelect, { ISelectOption } from "./AppSelect";
import { DataType } from "./AppTable";
import MaskedTextValidator from "./MaskedTextValidator";
import { TextValidator } from "react-material-ui-form-validator";
import { FormControlLabel, FormHelperText, Grid, Radio, RadioGroup } from "@material-ui/core";
import { AppModal } from ".";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

type GridSize = boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export enum InputType {
    Text = 0,
    Radio = 1,
    Select = 2,
    Date = 3,
    DateTime = 4
}
export interface IOption {
    id: any;
    name: string;
}
export interface IRequestField<TRequest> {
    name: keyof TRequest,
    label: string,
    type: DataType,
    inputType?: InputType
    validators?: any[],
    errorMessages?: string[],
    helperText?: string,
    getValue?: () => any,
    setValue?: () => React.Dispatch<React.SetStateAction<any> | string>,
    dataSource?: IOption[] | string,
    xs?: GridSize,
    sm?: GridSize,
    md?: GridSize,
    lg?: GridSize,
    xl?: GridSize,
    mask?: maskArray | ((value: string) => maskArray),
    renderField?: (field: IRequestField<TRequest>) => ReactNode,
}

export interface IRequestFieldWithOptions<TRequest, TOptions> extends IRequestField<TRequest> {
    adaptResponse: (data: TOptions) => ISelectOption | null | undefined,
}
type FormModalProps<TRequest> = {
    currentId?: string | null,
    open: boolean,
    title?: string,
    dataSource?: string | null,
    requestFields: IRequestField<TRequest>[],
    getRequest: () => TRequest,
    onSave: () => void,
    onError: (err: AxiosError) => void,
    onClose: () => void,
    children?: ReactNode
};

export default function FormModal<TRequest>({ children, open, title, dataSource, requestFields, getRequest, onSave, onError, onClose, ...props }: FormModalProps<TRequest>) {
    const baseUrl = process.env.REACT_APP_API_URL;
    const [saving, setSaving] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string | null | undefined>(props.currentId);

    const handleChange = (setState: React.Dispatch<React.SetStateAction<unknown> | string>) => (event: React.ChangeEvent<{ value: unknown }>) => {
        setState(event.target.value);
    };

    const handleSubmit = (e: React.FormEvent<Element>) => {
        handleSave(getRequest());
    }

    const handleSave = async (request: TRequest) => {

        setSaving(true);
        try {
            if (currentId) {
                await axios.put(`${baseUrl}${dataSource}/${currentId}`, request);
                setCurrentId(null);
            }
            else {
                await axios.post<string>(`${baseUrl}${dataSource}`, request);
            }
            requestFields.forEach(field => {
                if (field.setValue)
                    field.setValue()('');
            });

            onSave();
        }
        catch (err) {
            onError(err);
        }
        setSaving(false);
    }

    const adaptResponse = (data: IOption): ISelectOption | null | undefined => {
        return { value: data.id, text: data.name }
    }

    const getInput = (field: IRequestField<TRequest>) => {

        if (field.renderField) return field.renderField(field);

        if (field.inputType === undefined || field.inputType === InputType.Text) {
            if (field.mask)
                return <MaskedTextValidator fullWidth mask={field.mask}
                    validators={field.validators}
                    errorMessages={field.errorMessages}
                    id={field.name.toString()} name={field.name.toString()}
                    label={field.label}
                    value={field.getValue ? field.getValue() : undefined}
                    helperText={field.helperText}
                    variant="outlined"
                    onChange={field.setValue ? handleChange(field.setValue()) : undefined}
                />

            return <TextValidator fullWidth
                validators={field.validators}
                errorMessages={field.errorMessages}
                id={field.name.toString()} name={field.name.toString()}
                label={field.label}
                value={field.getValue ? field.getValue() : undefined}
                helperText={field.helperText}
                variant="outlined"
                onChange={field.setValue ? handleChange(field.setValue()) : undefined}
            />
        }

        switch (field.inputType) {
            case InputType.Select:
                return field.dataSource ? (
                    <AppSelect
                        label={field.label}
                        helperText={field.helperText}
                        value={field.getValue ? field.getValue() : undefined}
                        onChange={field.setValue ? handleChange(field.setValue()) : undefined}
                        dataSource={field.dataSource ? field.dataSource : []}
                        adaptResponse={(field as any).adaptResponse || adaptResponse} />
                ) : null;
            case InputType.Radio:
                return (
                    <RadioGroup row
                        aria-label={field.name.toString()}
                        name={field.name.toString()}
                        value={field.getValue ? field.getValue() : undefined}
                        onChange={field.setValue ? handleChange(field.setValue()) : undefined}>
                        {field.dataSource && Array.isArray(field.dataSource) && (field.dataSource as IOption[]).map(option => (
                            <FormControlLabel key={option.id}
                                value={option.id}
                                control={<Radio color="primary" />}
                                label={option.name}
                                labelPlacement="end"
                            />
                        ))}
                    </RadioGroup>
                );
            case InputType.DateTime:
                return (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={2}>
                            <Grid item xs={7}>
                                <KeyboardDatePicker
                                    margin="none"
                                    id={field.name.toString()}
                                    label={field.label}
                                    format="dd/MM/yyyy"
                                    inputVariant="outlined"
                                    value={field.getValue ? field.getValue() : undefined}
                                    onChange={(date: Date | null) => field.setValue && field.setValue()(date)}
                                    KeyboardButtonProps={{
                                        'aria-label': field.label,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={5}>
                                <KeyboardTimePicker
                                    margin="none"
                                    id={`${field.name.toString()}Time`}
                                    label="às"
                                    inputVariant="outlined"
                                    value={field.getValue ? field.getValue() : undefined}
                                    onChange={(date: Date | null) => field.setValue && field.setValue()(date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'às',
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {field.helperText && <FormHelperText id={field.name.toString()}>{field.helperText}</FormHelperText>}
                    </MuiPickersUtilsProvider>
                );
        }

    }

    useEffect(() => {
        if (props.currentId !== currentId) {
            setCurrentId(props.currentId);
        }
    }, [currentId, props.currentId])

    return (
        <AppModal open={open} onClose={onClose} onSubmit={handleSubmit} title={title || 'Formulário'} fullScreen={isMobile} saving={saving}>
            <Grid container spacing={2}>
                {requestFields.map((field, idx) => (
                    <Grid item xs={field.xs || 12} sm={field.sm} md={field.md} lg={field.lg} xl={field.xl} key={idx}>
                        {getInput(field)}
                    </Grid>
                ))}
            </Grid>
        </AppModal>
    );
}