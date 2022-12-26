import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import axios from 'axios';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Popover, Select, Table, TableBody, TableCell, TableContainer, TextField } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';

import { PagedListResult } from '../../models';
import { Collapse } from '@material-ui/core';

import 'moment/locale/pt-br';
import { usePrevious } from '.';

moment.locale('pt-br');

interface Data {
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type Order = 'asc' | 'desc';

export enum DataType {
    String = 'string',
    Integer = 'integer',
    Float = 'float',
    Currency = 'currency',
    Date = 'date',
    Enum = 'enum'
}
export interface IColumn<T> {
    disablePadding?: boolean;
    id?: keyof T;
    label?: string;
    type?: DataType;
    sortable?: boolean;
    filterable?: boolean;
    width?: number;
    hidden?: boolean;
    getOptions?: () => { id: any, name: string }[]
    onCellRender?: (row: T) => JSX.Element | string;
}

interface AppTableHeadProps<T> {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property?: keyof T) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: keyof T | null;
    columns: IColumn<T>[];
    fetching: boolean;
}

function AppTableHead<T>(props: AppTableHeadProps<T>) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, onRequestSort } = props;
    const createSortHandler = (property?: keyof T) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {props.columns.filter(c => !c.hidden).map((headCell, idx) => (
                    <TableCell
                        key={headCell.id?.toString() || headCell.label || idx}
                        align={headCell.type === DataType.Integer || headCell.type === DataType.Float ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.width}>

                        {headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}>
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        ) : headCell.label}

                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
        popover: {
            maxWidth: '400px'
        }
    }),
);

interface EnhancedTableToolbarProps<T> {
    selected: string[] | null;
    title?: string;
    onEdit?: (id: string) => void;
    onDelete?: (items: string[]) => void;
    onFilterChange?: (column: IColumn<T>, value: any) => void;
    onFiltering?: (filter?: FilterState<T>) => void;
    onChoose?: (items: string[]) => void;
    chooseIcon?: JSX.Element | string;
    fetching: boolean;
    columns: IColumn<T>[];
    editable?: boolean;
}

interface FilterState<T> {
    [column: string]: string;
}
function EnhancedTableToolbar<T>(props: EnhancedTableToolbarProps<T>) {
    const classes = useToolbarStyles();
    const { selected, onDelete, onEdit, onChoose, onFilterChange, onFiltering, fetching, columns, chooseIcon, editable } = props;
    const numSelected = selected?.length || 0;

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [filter, setFilter] = React.useState<FilterState<T>>({});
    const filterableColumns = columns.filter(c => c.filterable && c.id);

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        if (!fetching && onDelete && selected) onDelete(selected);
    }
    const handleChooseClick = () => {
        if (!fetching && onChoose && selected) onChoose(selected);
    }

    const handleEditClick = () => {
        if (!fetching && onEdit && selected) onEdit(selected[0]);
    }

    const handleFilterChange = (column: IColumn<T>) => (event: React.ChangeEvent<{ value: unknown }>) => {
        if (column.id) {
            const filterState = { ...filter };
            filterState[column.id.toString()] = event.target.value as string;
            setFilter(filterState);
        }
        if (onFilterChange) onFilterChange(column, event.target.value);

    }

    const handleApplyFilterClick = () => {
        if (onFiltering) onFiltering(filter);
        setAnchorEl(null);
    }

    const handleClearFilterClick = () => {
        setFilter({});
        if (onFiltering) onFiltering({});
        setAnchorEl(null);
    }

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}>
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selecionados
                </Typography>
            ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                        {props.title}
                    </Typography>
                )}

            {fetching && (
                <CircularProgress />
            )}

            {numSelected > 0 ? (
                <React.Fragment>
                    {editable && onEdit && numSelected == 1 && (
                        <Tooltip title="Editar">
                            <IconButton aria-label="edit" onClick={handleEditClick}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {editable && onDelete && (
                        <Tooltip title="Excluir">
                            <IconButton aria-label="delete" onClick={handleDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {onChoose && (
                        <Tooltip title="Escolher">
                            <IconButton aria-label="choose" onClick={handleChooseClick}>
                                {chooseIcon}
                            </IconButton>
                        </Tooltip>
                    )}
                </React.Fragment>
            ) : (
                    <React.Fragment>
                        <Tooltip title="Filter list">
                            <IconButton aria-label="filter list" aria-describedby={id} onClick={handleFilterClick}>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                        {filterableColumns.length > 0 && (
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleFilterClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}>
                                <Box p={2} className={classes.popover}>
                                    <Typography variant="h6" gutterBottom>Filtrar por:</Typography>
                                    <Grid container spacing={2}>
                                        {filterableColumns.map((column, idx) => (
                                            <Grid item xs={12} key={idx}>
                                                {column.type === DataType.Enum && column.getOptions && (
                                                    <FormControl size="small" variant="outlined" fullWidth>
                                                        <InputLabel id={column.id?.toString()}>
                                                            {column.label}
                                                        </InputLabel>
                                                        <Select
                                                            label={column.label}
                                                            labelId={column.id?.toString()}
                                                            id={column.id?.toString()}
                                                            value={filter && column.id ? filter[column.id.toString()] : ''}
                                                            onChange={handleFilterChange(column)}>
                                                            <MenuItem value="">
                                                                <em>Todos</em>
                                                            </MenuItem>
                                                            {column.getOptions().map(option => (
                                                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                {column.type !== DataType.Enum && (
                                                    <TextField fullWidth
                                                        id={column.id?.toString()}
                                                        name={column.id?.toString()}
                                                        label={column.label}
                                                        defaultValue={filter && column.id ? filter[column.id.toString()] : ''}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={handleFilterChange(column)}
                                                    />
                                                )}

                                            </Grid>
                                        ))}


                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Button variant="contained" size="small" color="primary" onClick={handleApplyFilterClick}
                                                startIcon={<SearchIcon />}>
                                                Aplicar
                                        </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" size="small" onClick={handleClearFilterClick}
                                                startIcon={<DeleteIcon />}>
                                                Limpar
                                        </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Popover>
                        )}
                    </React.Fragment>
                )}

        </Toolbar>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 250,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        alert: {
            marginBottom: theme.spacing(2),
        }
    }),
);

type AppTableProps<T> = {
    tableKey?: string | number | null,
    columnKey: keyof T,
    title?: string,
    dataSource: string,
    columns: IColumn<T>[],
    rowsPerPageOptions?: Array<number | { value: number; label: string }>,
    onDelete?: (items: string[]) => void,
    onEdit?: (id: string) => void,
    onChoose?: (items: string[]) => void,
    chooseIcon?: JSX.Element | string;
    editable?: boolean;
}

export default function AppTable<T>({
    tableKey, columns, dataSource, title, rowsPerPageOptions, columnKey,
    onDelete, onEdit, onChoose, chooseIcon, editable
}: AppTableProps<T>) {
    const baseUrl = process.env.REACT_APP_API_URL;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof T | null>(null);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [pagedList, setPagedList] = React.useState<PagedListResult<T> | null>(null);
    const [error, setError] = React.useState<Error | null>(null);
    const [errorOpen, setErrorOpen] = React.useState(error != null);
    const [fetching, setFetching] = React.useState<boolean>(false);
    const prevKey = usePrevious(tableKey);
    const [filter, setFilter] = React.useState<FilterState<T>>({});

    const handleFilterChange = (column: IColumn<T>, value: any) => {

    }

    const handleApplyFilterClick = (f?: FilterState<T>) => {
        if (f) setFilter(f);
    }

    const handleRequestSort = (event: React.MouseEvent<unknown>, property?: keyof T) => {
        if (property) {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = pagedList?.items.map((n: any) => n[columnKey].toString());
            setSelected(newSelecteds || []);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        toggleSelection(id);
    };

    const toggleSelection = (id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async (items: string[]) => {

        setFetching(true);

        for (const id of items) {
            try {
                await axios.delete(`${baseUrl}${dataSource}/${id}`);
                toggleSelection(id);


            } catch (error) {

            }
        }
        if (onDelete) onDelete(items);
        await fetchData(baseUrl || '', dataSource, order, orderBy, filter, page, rowsPerPage);
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, (pagedList?.items.length || 0) - page * rowsPerPage);

    const fetchData = async (
        baseUrl: string, dataSource: string,
        order: Order, orderBy: keyof T | null, filter: FilterState<T>,
        page: number,
        rowsPerPage: number
    ): Promise<void> => {
        let url = `${baseUrl}${dataSource}?pageIndex=${page + 1}&pageSize=${rowsPerPage}`;

        if (orderBy) {
            url += `&orderBy=${orderBy}:${order}`;
        }

        if (filter) {
            Object.keys(filter).forEach(column => url += `&filterBy=${column}:sw(${filter[column]})`)
        }
        setFetching(true);
        try {
            const res = await axios(url);
            setPagedList(res.data);
            setFetching(false);
        } catch (error) {
            setError(error);
            setFetching(false);
        }
    };

    useEffect(() => {

        fetchData(baseUrl || '', dataSource, order, orderBy, filter, page, rowsPerPage);

    }, [baseUrl, dataSource, order, orderBy, filter, page, rowsPerPage]);

    useEffect(() => {
        if (error != null) {
            setErrorOpen(true);
        }
    }, [error]);

    useEffect(() => {
        if (tableKey !== prevKey) {
            fetchData(baseUrl || '', dataSource, order, orderBy, filter, page, rowsPerPage);
        }
    }, [baseUrl, dataSource, error, tableKey, order, orderBy, filter, page, prevKey, rowsPerPage]);

    const isSelected = (id: string | null) => id ? selected.indexOf(id) !== -1 : false;

    const getValue = (column: IColumn<T>, row: T) => {
        if (column.id) {
            switch (column.type) {
                case DataType.Date:
                    return moment(row[column.id]).format('DD/MM/YYYY à\\s HH:mm');
                default:
                    return row[column.id];
            }
        }
        return null;
    }
    return (
        <div className={classes.root} key={tableKey}>
            <Collapse in={errorOpen}>
                <Alert severity="error" className={classes.alert} action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setErrorOpen(false);
                        }}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>{error?.message}</Alert>
            </Collapse>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    selected={selected} title={title}
                    onDelete={handleDelete}
                    onEdit={onEdit}
                    onChoose={onChoose}
                    onFilterChange={handleFilterChange}
                    onFiltering={handleApplyFilterClick}
                    fetching={fetching}
                    columns={columns}
                    chooseIcon={chooseIcon}
                    editable={editable}
                />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table">
                        <AppTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            columns={columns}
                            fetching={fetching}
                        />
                        <TableBody>
                            {pagedList?.items.map((row: any, index) => {
                                const isItemSelected = isSelected(row[columnKey]?.toString());
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row[columnKey].toString())}
                                        tabIndex={-1}
                                        aria-checked={isItemSelected}
                                        selected={isItemSelected}
                                        key={row[columnKey] || index}>

                                        {columns.map((column: IColumn<T>, idx) => {

                                            if (column.hidden) return null;

                                            let value: any = getValue(column, row);
                                            value = column.getOptions ? column.getOptions().find(o => o.id === value.toString())?.name : value;

                                            return (
                                                <TableCell key={column.id?.toString() || column.label || idx}>
                                                    {column.onCellRender ? column.onCellRender(row) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                            {pagedList != null && pagedList.items.length == 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={columns.length} align="center">no data</TableCell>
                                </TableRow>
                            )}
                            {pagedList == null && error == null && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={columns.length} align="center">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions || [5, 10, 25]}
                    component="div"
                    count={pagedList?.totalCount || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}