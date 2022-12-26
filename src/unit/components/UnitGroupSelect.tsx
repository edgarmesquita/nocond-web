import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Autocomplete, { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import { UnitGroup } from '../models';
import { useDispatch, useSelector } from 'react-redux';
import { getUnitGroup, setClearUnitGroup, setStoreUnitGroup } from '../../store/unit/actions';
import { PagedListResult } from '../../models';
import { createStyles, StyleRules, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { CircularProgress, TextField } from '@material-ui/core';

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        autocomplete: {

        },
        input: {

        }
    });

type UnitGroupSelectProps = {
    className?: string,
    inputClassName?: string
} & WithStyles<typeof styles>;

const UnitGroupSelect = ({ classes, className, inputClassName }: UnitGroupSelectProps) => {
    const dispatch = useDispatch();
    const storedUnitGroup = useSelector(getUnitGroup);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [unitGroup, setUnitGroup] = React.useState<UnitGroup | null | undefined>(storedUnitGroup);
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<UnitGroup[]>([]);
    const loading = open && options.length === 0;
    const [searchTerm, setSearchTerm] = React.useState<string>('');

    const updateOptions = useCallback(async (active: boolean) => {
        let url = `${baseUrl}/v1/unit-groups?pageIndex=1&pageSize=20`;
        if (searchTerm !== '') url += `&filterBy=name:sw(${searchTerm})`;
        const response = await axios.get<PagedListResult<UnitGroup>>(url);
        const result = await response.data;

        if (active) {
            setOptions(result.items);
        }
    }, [baseUrl, searchTerm]);

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        updateOptions(active);

        return () => {
            active = false;
        };
    }, [baseUrl, loading, updateOptions]);



    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        if (storedUnitGroup?.id !== unitGroup?.id) {
            setUnitGroup(storedUnitGroup);
        }
    }, [storedUnitGroup, unitGroup]);

    const handleChange = (e: React.ChangeEvent<{}>, value: UnitGroup | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<UnitGroup | undefined>) => {
        setUnitGroup(value);
        if (value) dispatch(setStoreUnitGroup(value));
        else dispatch(setClearUnitGroup())
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        updateOptions(true);
    }
    return (
        <Autocomplete
            id="unit-groups"
            fullWidth size="small" className={clsx(className, classes.autocomplete)}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onChange={handleChange}
            value={unitGroup}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField onChange={handleInputChange}
                    {...params}
                    label="Selecione um condomínio"
                    variant="outlined" className={clsx(inputClassName, classes.input)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    )
}
export default withStyles(styles)(UnitGroupSelect);