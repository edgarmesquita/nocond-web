import React, { ReactNode, useState } from "react";
import { isMobile } from 'react-device-detect';
import axios, { AxiosError } from 'axios';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { Fab, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup } from "@material-ui/core";

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { AppModal, AppSelect, ISelectOption } from "../../shared/components";
import { TextValidator } from "react-material-ui-form-validator";
import { FloorType, UnitRangeRequest, UnitType } from "../models";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        contentClassName: {
            backgroundColor: '#DDD'
        },
        paper: {
            padding: theme.spacing(2),
            position: 'relative',
            marginBottom: theme.spacing(1)
        },
        topPaper: {
            margin: `-${theme.spacing(2)}px -${theme.spacing(2)}px ${theme.spacing(3)}px -${theme.spacing(2)}px`,
            padding: theme.spacing(2)
        },
        label: {
            display: 'block',
            marginTop: `-${theme.spacing(1)}px`,
            paddingBottom: theme.spacing(2),
            ...theme.typography.body2
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
        addButton: {
            position: 'absolute',
            left: '50%',
            marginLeft: '-20px',
            bottom: theme.spacing(0.5)
        },
        removeButton: {
            position: 'absolute',
            top: theme.spacing(.5),
            right: theme.spacing(.5)
        }
    });

interface UnitRange {
    floor: number;
    floorType: FloorType;
    codeStart: number;
    codeEnd: number;
    codeType: "prefix" | "suffix";
    code?: string;
    unitTypeId: string;
}

type UnitRangeModalProps = {
    open: boolean,
    onClose: () => void,
    onSave: (success: boolean, error?: AxiosError) => void,
    children?: ReactNode,
    unitGroupId: string
} & WithStyles<typeof styles>;

const UnitRangeModal = ({ classes, children, open, unitGroupId, onClose, onSave, }: UnitRangeModalProps) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const [block, setBlock] = useState<string>('');
    const [side, setSide] = useState<string>('');
    const [blockDescription, setBlockDescription] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);

    const [ranges, setRanges] = useState<UnitRange[]>([
        { codeStart: 101, codeEnd: 120, floor: 1, floorType: FloorType.Floor, codeType: "prefix", unitTypeId: "" }
    ]);

    const handleChange = (setState: React.Dispatch<React.SetStateAction<any> | string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(event.target.value);
    };

    const handleItemChange = (field: keyof UnitRange, idx: number, parse?: (value: unknown) => any) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const items = [...ranges];
        (items[idx] as any)[field] = parse ? parse(event.target.value) : event.target.value;
        setRanges(items);
    }

    const floorTypes: FloorType[] = [
        FloorType.Underground, FloorType.GroundFloor, FloorType.Floor, FloorType.Roof
    ];

    const getFloorTypeSelOptions = () => {
        return Object.keys(FloorType)
            .filter(value => isNaN(Number(value)) === true)
            .map((key: any) => { return { value: FloorType[key] as any, text: key.toString() }; });
    }

    function adaptResponse<FloorType>(data: FloorType): ISelectOption | null | undefined {
        const list = getFloorTypeSelOptions();
        return list.find(o => o.value === data);
    }

    const handleAddItemClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const items = [...ranges];
        items.push({ codeStart: 101, codeEnd: 120, floor: 1, floorType: FloorType.Floor, codeType: "prefix", unitTypeId: "" });
        setRanges(items);
    }

    const handleRemoveItemClick = (index: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const items = [...ranges];
        items.splice(index, 1);
        setRanges(items);
    }

    const unitTypeAdaptResponse = (unitType: UnitType): ISelectOption | null | undefined => {
        return { value: unitType.id, text: unitType.name };
    };

    const handleSubmit = async (e: React.FormEvent<Element>) => {
        setSaving(true);
        try {

            const request: UnitRangeRequest[] = ranges.map((item: UnitRange) => {
                return {
                    codeStart: item.codeStart,
                    codeEnd: item.codeEnd,
                    codePrefix: item.codeType === "prefix" ? item.code : undefined,
                    codeSuffix: item.codeType === "suffix" ? item.code : undefined,
                    block,
                    blockDescription,
                    floor: item.floor,
                    floorType: item.floorType,
                    side,
                    unitTypeId: item.unitTypeId
                };
            })
            await axios.post(`${baseUrl}/v1/unit-groups/${unitGroupId}/units/range`, request);
            onSave(true);
        }
        catch (err) {
            onSave(false, err);
        }
        setSaving(false);
    }

    return (
        <AppModal open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={'Formulário'}
            fullScreen={isMobile}
            saving={saving} contentClassName={classes.contentClassName}>

            <Paper className={classes.topPaper} square elevation={3}>
                <Grid container spacing={2}>
                    <Grid item xs={4} sm={2}>
                        <TextValidator fullWidth
                            validators={['required']}
                            errorMessages={['']}
                            id={`block`} name={`block`}
                            label={'Bloco'}
                            value={block}
                            variant="outlined"
                            onChange={handleChange(setBlock)}
                        />
                    </Grid>
                    <Grid item xs={4} sm={6}>
                        <TextValidator fullWidth
                            validators={['required']}
                            errorMessages={['']}
                            id={`blockDescription`} name={`blockDescription`}
                            label={'Nome do Bloco'}
                            value={blockDescription}
                            variant="outlined"
                            onChange={handleChange(setBlockDescription)}
                        />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <TextValidator fullWidth
                            validators={['required']}
                            errorMessages={['']}
                            id={`side`} name={`side`}
                            label={'Nome da Ala'}
                            value={side}
                            variant="outlined"
                            onChange={handleChange(setSide)}
                        />
                    </Grid>
                </Grid>
            </Paper>
            {ranges.map((range, idx) => (
                <Paper className={classes.paper} key={idx}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={4}>
                            <FormLabel className={classes.label}>Andar da unidade</FormLabel>
                            <Grid container spacing={1}>
                                <Grid item xs={5}>
                                    <TextValidator fullWidth
                                        validators={['required']}
                                        errorMessages={['']}
                                        id={`floor${idx}`} name={`floor${idx}`}
                                        label={'Andar'}
                                        value={range.floor}
                                        variant="outlined"
                                        onChange={handleItemChange('floor', idx, (o) => Number(o))}
                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <AppSelect label="Tipo de And."
                                        value={range.floorType}
                                        selectText=""
                                        dataSource={floorTypes}
                                        onChange={handleItemChange('floorType', idx)}
                                        adaptResponse={adaptResponse} />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <FormLabel className={classes.label}>Range de unidades</FormLabel>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextValidator fullWidth
                                        validators={['required']}
                                        errorMessages={['']}
                                        id={`codeStart${idx}`} name={`codeStart${idx}`}
                                        label={'De'}
                                        value={range.codeStart}
                                        variant="outlined"
                                        onChange={handleItemChange('codeStart', idx, (o) => Number(o))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextValidator fullWidth
                                        validators={['required']}
                                        errorMessages={['']}
                                        id={`codeEnd${idx}`} name={`codeEnd${idx}`}
                                        label={'Até'}
                                        value={range.codeEnd}
                                        variant="outlined"
                                        onChange={handleItemChange('codeEnd', idx, (o) => Number(o))}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <FormLabel className={classes.label}>Letra da unidade</FormLabel>
                            <FormControl component="fieldset">

                                <RadioGroup row aria-label="codeType" name="codeType"
                                    value={range.codeType} onChange={handleItemChange('codeType', idx)}>
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
                                                id={`code${idx}`} name={`code${idx}`}
                                                label={'Letra'}
                                                value={range.code}
                                                variant="outlined"
                                                onChange={handleItemChange('code', idx)}
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

                        </Grid>
                        <Grid item xs={2}>
                            <FormLabel className={classes.label}>&nbsp;</FormLabel>
                            <AppSelect label="Tipo Unid."
                                value={range.unitTypeId}
                                selectText=""
                                dataSource={'/v1/unit-types'}
                                onChange={handleItemChange('unitTypeId', idx)}
                                adaptResponse={unitTypeAdaptResponse as any} />
                        </Grid>
                    </Grid>
                    {ranges.length > 1 && (
                        <IconButton size="small" color="secondary" className={classes.removeButton} onClick={handleRemoveItemClick(idx)}>
                            <DeleteIcon />
                        </IconButton>
                    )}

                </Paper>
            ))}
            <Fab size="small" color="primary" className={classes.addButton} onClick={handleAddItemClick}>
                <AddIcon />
            </Fab>
        </AppModal>
    );
}

export default withStyles(styles)(UnitRangeModal);