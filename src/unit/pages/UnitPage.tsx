import React, { useState } from "react";
import { isMobile } from 'react-device-detect';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import CrudPage from "../../shared/pages/CrudPage";
import { RouteComponentProps } from "react-router-dom";
import { DataType, IColumn } from "../../shared/components/AppTable";
import { FloorType, Unit, UnitGroup, UnitRequest, UnitType } from "../models";
import { useSelector } from "react-redux";
import { getUnitGroup } from "../../store/unit/actions";
import { Backdrop, CircularProgress, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@material-ui/core";
import { Alert, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";
import { useApiService } from "../../config/axios.config";

import AddIcon from '@material-ui/icons/Add';

import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import { TextValidator } from "react-material-ui-form-validator";
import UnitRangeModal from "../components/UnitRangeModal";
import { ISelectOption } from "../../shared/components";
import { AxiosError } from "axios";
import { InputType, IRequestField, IRequestFieldWithOptions } from "../../shared/components/FormModal";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        header: {
            marginBottom: '20px'
        },
        loading: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: "240px",
            flexGrow: 1,
        },
        speedDial: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        gridLeft: {
            textAlign: 'left',
        },
        gridRight: {
            textAlign: 'right',
        },
        radioLabel: {
            margin: theme.spacing(0),
            "& .MuiFormControlLabel-label": {
                fontSize: theme.spacing(1.4),
                marginTop: `-${theme.spacing(1)}px`
            }
        },
    });

interface UnitPageParam {
    unitGroupId?: string;
}
type UnitPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps<UnitPageParam>;

interface UnitRange {
    floor: string;
    floorType: FloorType;
    codeStart: number;
    codeEnd: number;
    codeType: "prefix" | "suffix";
    code?: string;
}
const UnitPage = ({ classes, ...props }: UnitPageProps) => {
    const storedUnitGroup = useSelector(getUnitGroup);
    const [code, setCode] = useState<string>('');
    const [codePrefix, setCodePrefix] = useState<string>('');
    const [codeSuffix, setCodeSuffix] = useState<string>('');
    const [codeComplement, setCodeComplement] = useState<"prefix" | "suffix">('prefix');
    const [block, setBlock] = useState<string>('');
    const [side, setSide] = useState<string>('');
    const [blockDescription, setBlockDescription] = useState<string>('');
    const [floor, setFloor] = useState<number>(0);
    const [floorType, setFloorType] = useState<FloorType>(0);
    const [unitTypeId, setUnitTypeId] = useState<string>('');

    const unitGroupId = props.match.params.unitGroupId || storedUnitGroup?.id;
    const [unitGroup, unitGroupError] = useApiService<UnitGroup>(unitGroupId ? `/v1/unit-groups/${unitGroupId}` : null);

    const [saving, setSaving] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [openSpeedDial, setOpenSpeedDial] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);

    const [error, setError] = useState<AxiosError | null | undefined>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [tableKey, setTableKey] = useState<number>(Math.random());

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleVisibility = () => {
        setHidden((prevHidden) => !prevHidden);
    };

    const handleOpenSpeedDial = () => {
        setOpenSpeedDial(true);
    };

    const handleCloseSpeedDial = () => {
        setOpenSpeedDial(false);
    };

    const handleSave = (success: boolean, error?: AxiosError) => {
        if (success) {
            setOpen(false);
            setTableKey(Math.random());
        }
        else {
            setError(error);
            setSnackbarOpen(true);
        }
    }

    const getFloorTypeOptions = () => {
        return Object.keys(FloorType)
            .filter(value => isNaN(Number(value)) === false)
            .map((key: any) => { return { id: key.toString(), name: FloorType[key] } });
    }
    const breadcrumbs = [
        { name: 'Condomínios', icon: 'apartment' },
        { name: 'Lista de Unidades', icon: 'list', path: unitGroupId ? `/unit-groups/${unitGroupId}/units` : '/units' }
    ];

    const columns: IColumn<Unit>[] = [
        { id: 'floor', label: 'Nº do Andar', type: DataType.String, sortable: true, filterable: true },
        { id: 'floorType', label: 'Tipo de Andar', type: DataType.Enum, sortable: true, filterable: true, getOptions: getFloorTypeOptions },
        { id: 'code', label: 'Unidade', type: DataType.String, sortable: true, filterable: true },
        { id: 'block', label: 'Nº do Bloco', type: DataType.String, sortable: true, filterable: true },
        { id: 'blockDescription', label: 'Nome Bloco', type: DataType.String, sortable: true, filterable: true },
        { id: 'side', label: 'Ala', type: DataType.String, sortable: true, filterable: true },
        { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
    ];

    const unitTypeField: IRequestFieldWithOptions<UnitRequest, UnitType> = {
        name: 'unitTypeId', label: 'Tipo de unidade', helperText: 'Tipo de unidade',
        type: DataType.String, inputType: InputType.Select, xs: 12,
        getValue: () => unitTypeId, setValue: () => setUnitTypeId, dataSource: '/v1/unit-types',
        adaptResponse: (unitType: UnitType): ISelectOption | null | undefined => {
            return { value: unitType.id, text: unitType.name };
        }
    };
    const requestFields: IRequestField<UnitRequest>[] = [
        unitTypeField,
        {
            name: 'block', label: 'Bloco', helperText: 'Número do bloco',
            type: DataType.String, xs: 3,
            getValue: () => block, setValue: () => setBlock
        },
        {
            name: 'blockDescription', label: 'Nome do Bloco', helperText: 'Nome do bloco',
            type: DataType.String, xs: 6,
            getValue: () => blockDescription, setValue: () => setBlockDescription
        },
        {
            name: 'side', label: 'Ala', helperText: 'Nome da Ala',
            type: DataType.String, xs: 3,
            getValue: () => side, setValue: () => setSide
        },
        {
            name: 'floor', label: 'Andar', helperText: 'Número do Andar',
            type: DataType.String, xs: 2,
            validators: ['required'], errorMessages: ['O número do andar é obrigatório'],
            getValue: () => floor, setValue: () => setFloor
        },
        {
            name: 'floorType', label: 'Tipo de Andar', helperText: 'Tipo de Andar',
            type: DataType.Enum, inputType: InputType.Select, xs: 4,
            getValue: () => floorType, setValue: () => setFloorType, dataSource: getFloorTypeOptions()
        },
        {
            name: 'code', label: 'Unidade', helperText: 'Número da unid.',
            type: DataType.String, xs: 3,
            validators: ['required'], errorMessages: ['O número da unidade é obrigatório'],
            getValue: () => code, setValue: () => setCode
        },
        {
            name: 'codePrefix', label: 'Letra', helperText: 'Letra unidade', type: DataType.String, xs: 3,
            renderField: (field) => (
                <React.Fragment>
                    <FormControl component="fieldset">

                        <RadioGroup row
                            aria-label="codeComplementType"
                            name="codeComplementType"
                            value={codeComplement}
                            onChange={handleChange(setCodeComplement)}>

                            <Grid container>
                                <Grid item xs={3} className={classes.gridLeft}>
                                    <FormControlLabel className={classes.radioLabel}
                                        value={"prefix"}
                                        control={<Radio color="primary" size="small" />}
                                        label="Pref."
                                        labelPlacement="top"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextValidator fullWidth
                                        validators={[]}
                                        errorMessages={[]}
                                        id={`codeComplement`} name={`codeComplement`}
                                        label={field.label}
                                        helperText={field.helperText}
                                        value={codeComplement === 'prefix' ? codePrefix : codeSuffix}
                                        variant="outlined"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            if (codeComplement === 'prefix') {
                                                setCodeSuffix('');
                                                setCodePrefix(event.target.value);
                                            }
                                            else {
                                                setCodeSuffix(event.target.value);
                                                setCodePrefix('');
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3} className={classes.gridRight}>
                                    <FormControlLabel className={classes.radioLabel}
                                        value="suffix"
                                        control={<Radio color="primary" size="small" />}
                                        label="Suf."
                                        labelPlacement="top"
                                    />
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </React.Fragment>
            ),
        }
    ];

    const getRequest = (): UnitRequest => {
        return { code, codePrefix, codeSuffix, block, blockDescription, floor, floorType, side, unitTypeId };
    }

    const handleChange = (setState: React.Dispatch<React.SetStateAction<any> | string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(event.target.value);
    };

    return (
        <CrudPage
            columnKey="id" tableKey={tableKey}
            title={`${unitGroup?.name} - Lista de Unidades`}
            dataSource={unitGroup ? `/v1/unit-groups/${unitGroup.id}/units` : null}
            breadcrumbs={breadcrumbs}
            columns={columns}
            requestFields={requestFields} error={error} snackbarOpen={snackbarOpen}
            getRequest={getRequest} {...props} onButtonAddRender={(onClick) => (
                <React.Fragment>
                    <Backdrop open={openSpeedDial} />
                    <SpeedDial
                        ariaLabel="Adicionar unidades"
                        className={classes.speedDial}
                        hidden={hidden}
                        icon={<SpeedDialIcon />}
                        onClose={handleCloseSpeedDial}
                        onOpen={handleOpenSpeedDial}
                        open={openSpeedDial} >


                        <SpeedDialAction
                            icon={<AddIcon />}
                            tooltipTitle={"Adicionar"}
                            tooltipOpen
                            onClick={() => { handleCloseSpeedDial(); onClick(); }}
                        />
                        <SpeedDialAction
                            icon={<DynamicFeedIcon />}
                            tooltipTitle={"Adicionar sequência"}
                            tooltipOpen
                            onClick={() => { handleCloseSpeedDial(); handleClickOpen(); }}
                        />
                    </SpeedDial>
                </React.Fragment>
            )}>

            {unitGroupId && unitGroup == null && unitGroupError == null && (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            )}

            {!unitGroupId && (
                <React.Fragment>
                    <Typography variant="h6" gutterBottom>Lista de Unidades</Typography>
                    <Alert severity="warning">{"Selecione um condomínio"}</Alert>
                </React.Fragment>
            )}

            {unitGroupId && <UnitRangeModal unitGroupId={unitGroupId} open={open} onClose={handleClose} onSave={handleSave} />}
        </CrudPage>
    );
}

export default withStyles(styles)(UnitPage);