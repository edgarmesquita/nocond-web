import React, { useEffect, useState } from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core";
import { useApiService } from "../../config/axios.config";
import { PagedListResult } from "../../models";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    });

export interface ISelectOption {
    value: any, text: string
}
type AppSelectProps<T> = {
    id?: string,
    label?: string,
    value?: any,
    dataSource?: string | T[],
    selectText?: string,
    helperText?: string,
    size?: 'small' | 'medium',
    adaptResponse: (data: T) => ISelectOption | null | undefined,
    onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void
} & WithStyles<typeof styles>;

function AppSelect<T>({ classes, id, label, value, selectText, helperText, dataSource, size, adaptResponse, onChange }: AppSelectProps<T>) {
    const isUrl = dataSource && (typeof dataSource === 'string' || dataSource instanceof String);
    const url: string | null = isUrl ? `${dataSource}?pageIndex=1&pageSize=100` : null;
    const [pagedListResult, errors] = useApiService<PagedListResult<T>>(url);
    const [items, setItems] = useState<T[] | null>(pagedListResult ? pagedListResult.items : isUrl ? [] : dataSource as T[]);

    useEffect(() => {
        if (pagedListResult) {
            setItems(pagedListResult.items)
        }
    }, [pagedListResult]);

    return (
        <FormControl size={size} variant="outlined" fullWidth>
            <InputLabel id={id}>
                {label}
            </InputLabel>
            <Select
                label={label}
                labelId={id}
                id={id}
                value={value}
                onChange={onChange}>

                {selectText && (
                    <MenuItem value="">
                        <em>{selectText}</em>
                    </MenuItem>
                )}

                {items && items.map(item => {
                    const option = adaptResponse(item);
                    return option ? (
                        <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                    ) : null;
                })}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}

export default withStyles(styles)(AppSelect);