import React, { ReactNode } from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { isMobile } from 'react-device-detect';
import { RouteComponentProps } from "react-router-dom";
import { Person, PersonRequest, PersonType } from "../models";
import { CrudPage } from "../../shared";
import AppTable, { DataType, IColumn } from "../../shared/components/AppTable";
import { InputType, IRequestField } from "../../shared/components/FormModal";
import { IRoute } from "../../shared/components/AppBreadcrumbs";
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@material-ui/core";

import PersonPinIcon from '@material-ui/icons/PersonPin';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import { AppModal } from "../../shared/components";
import { useApiService } from "../../config/axios.config";
import { PagedListResult } from "../../models";
import { FloorType, Unit } from "../../unit/models";
import { UnitGroupSelect } from "../../unit/components";
import { useSelector } from "react-redux";
import { getUnitGroup } from "../../store/unit/actions";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        unitGroupSelect: {
            marginBottom: theme.spacing(2),
        },
        rightColumn: {
            backgroundColor: '#DDD',
            flexGrow: 1,
            minHeight: '280px',
            margin: `-${theme.spacing(1)}px -${theme.spacing(1)}px -${theme.spacing(1)}px ${theme.spacing(1)}px`,
            [theme.breakpoints.down('xs')]: {
                margin: theme.spacing(1),
            },
        },
        listItem: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            marginBottom: theme.spacing(1)
        }
    });

type PersonPageProps = { children?: ReactNode } & WithStyles<typeof styles> & RouteComponentProps;

const PersonPage = ({ classes, children, ...props }: PersonPageProps) => {
    const storedUnitGroup = useSelector(getUnitGroup);

    const [open, setOpen] = React.useState<boolean>(false);
    const [saving, setSaving] = React.useState<boolean>(false);
    const [currentPerson, setCurrentPerson] = React.useState<Person | null>(null);
    const [unitPagedList, unitPagedListError] = useApiService<PagedListResult<Unit>>(currentPerson ? `/v1/people/${currentPerson.id}/units` : null);

    const [name, setName] = React.useState<string>('');
    const [nickname, setNickname] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState<string>('');
    const [idNumber, setIdNumber] = React.useState<string>('');
    const [taxNumber, setTaxNumber] = React.useState<string>('');
    const [type, setType] = React.useState<PersonType>(0);
    const [address1, setAddress1] = React.useState<string>('');
    const [address2, setAddress2] = React.useState<string>('');
    const [postalCode, setPostalCode] = React.useState<string>('');
    const [addressNumber, setAddressNumber] = React.useState<string>('');
    const [city, setCity] = React.useState<string>('');
    const [state, setState] = React.useState<string>('');

    const setTypeFromStr = (type: string) => {
        setType(Number(type));
    }

    const handleOwnerClick = (data: Person) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setCurrentPerson(data);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent<Element>) => {
        // submit
    }

    const breadcrumbs: IRoute[] = [
        { name: 'Pessoas', icon: 'people' },
        { name: 'Lista de Pessoas', path: '/people' }
    ];
    const getOptions = () => [{ id: 0, name: 'Pessoa Física' }, { id: 1, name: 'Pessoa Jurídica' }];

    const columns: IColumn<Person>[] = [
        { id: 'name', label: 'Nome / RS', type: DataType.String, sortable: true, filterable: true },
        { id: 'nickname', label: 'Sobrenome / NF', type: DataType.String, sortable: true, filterable: true },
        { id: 'type', label: 'Tipo', type: DataType.Enum, sortable: true, filterable: true, getOptions: getOptions },
        { id: 'createdOn', label: 'Criado em', type: DataType.Date, sortable: true, width: 180 },
        {
            onCellRender: (data: Person) => (
                <Tooltip title="Unidades">
                    <IconButton color="primary" aria-label="Unidades" onClick={handleOwnerClick(data)}>
                        <PersonPinIcon />
                    </IconButton>
                </Tooltip>
            ), width: 80
        }
    ];

    const requestFields: IRequestField<PersonRequest>[] = [
        {
            name: 'type', label: 'Tipo de Pessoa', dataSource: getOptions(),
            type: DataType.Enum, inputType: InputType.Radio,
            getValue: () => type, setValue: () => setTypeFromStr
        },
        {
            name: 'name', label: type === PersonType.Fisical ? 'Nome' : 'Razão Social', helperText: '',
            type: DataType.String, validators: ['required'], errorMessages: [type === PersonType.Fisical ? 'O nome é obrigatório' : 'A razão social é obrigatória'],
            getValue: () => name, setValue: () => setName
        },
        {
            name: 'nickname', label: type === PersonType.Fisical ? 'Sobrenome' : 'Nome Fantasia', helperText: '',
            type: DataType.String, validators: type === PersonType.Fisical ? ['required'] : [], errorMessages: type === PersonType.Fisical ? ['O sobrenome é obrigatório'] : [],
            getValue: () => nickname, setValue: () => setNickname
        },
        {
            name: 'email', label: 'E-mail', helperText: '',
            type: DataType.String, validators: ['required'], errorMessages: ['O e-mail é obrigatório'],
            getValue: () => email, setValue: () => setEmail
        },
        {
            name: 'phoneNumber', label: 'Telefone', helperText: '',
            type: DataType.String, xs: 6,
            getValue: () => phoneNumber, setValue: () => setPhoneNumber
        },
        {
            name: 'mobilePhoneNumber', label: 'Celular', helperText: '',
            type: DataType.String, xs: 6,
            getValue: () => mobilePhoneNumber, setValue: () => setMobilePhoneNumber
        },
        {
            name: 'idNumber', label: type === PersonType.Fisical ? 'Identidade' : 'Inscr. Estad./Munic.', helperText: '',
            type: DataType.String, validators: ['required'], errorMessages: [type === PersonType.Fisical ? 'A identidade é obrigatória' : 'A inscrição estadual/municipal é obrigatória'], xs: 6,
            getValue: () => idNumber, setValue: () => setIdNumber
        },
        {
            name: 'taxNumber', label: type === PersonType.Fisical ? 'CPF' : 'CNPJ', helperText: '',
            type: DataType.String, validators: ['required'],
            errorMessages: [type === PersonType.Fisical ? 'O CPF é obrigatório' : 'O CNPJ é obrigatório'],
            xs: 6, mask: type === PersonType.Fisical ?
                [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/] :
                [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
            getValue: () => taxNumber, setValue: () => setTaxNumber
        },
        {
            name: 'address1', label: 'Endereço', helperText: '',
            type: DataType.String, xs: 9,
            getValue: () => address1, setValue: () => setAddress1
        },
        {
            name: 'postalCode', label: 'CEP', helperText: '',
            type: DataType.String, xs: 3, mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
            getValue: () => postalCode, setValue: () => setPostalCode
        },
        {
            name: 'address2', label: 'Complemento', helperText: '',
            type: DataType.String, xs: 9,
            getValue: () => address2, setValue: () => setAddress2
        },
        {
            name: 'addressNumber', label: 'Número', helperText: '',
            type: DataType.String, xs: 3,
            getValue: () => addressNumber, setValue: () => setAddressNumber
        },
        {
            name: 'city', label: 'Cidade', helperText: '',
            type: DataType.String, xs: 6,
            getValue: () => city, setValue: () => setCity
        },
        {
            name: 'state', label: 'Estado', helperText: '',
            type: DataType.String, xs: 6,
            getValue: () => state, setValue: () => setState
        },

    ];

    const getRequest = (): PersonRequest => {
        return {
            type, name, nickname, email, phoneNumber, mobilePhoneNumber,
            idNumber, taxNumber, address1, address2, addressNumber, city,
            state, postalCode
        }
    }

    const adaptRequest = (person: Person): PersonRequest => {
        return {
            type: person.type,
            name: person.name,
            nickname: person.nickname,
            email: person.email,
            phoneNumber: person.phoneNumber,
            mobilePhoneNumber: person.mobilePhoneNumber,
            idNumber: person.idNumber,
            taxNumber: person.taxNumber,
            address1: person.address?.address1,
            address2: person.address?.address2,
            addressNumber: person.address?.number,
            state: person.address?.state,
            city: person.address?.city,
            postalCode: person.address?.postalCode,
        }
    }

    const floorTypes = [
        "Subsolo",
        "Térreo",
        "Andar",
        "Cobertura"
    ];

    const getFloorTypeOptions = () => {
        return Object.keys(FloorType)
            .filter(value => isNaN(Number(value)) === false)
            .map((key: any) => { return { id: key.toString(), name: FloorType[key] } });
    }

    const getUnitDescription = (item: Unit): string => {
        let unit = '';
        if (item.block)
            unit += `Bloco ${item.block} `;
        if (item.blockDescription)
            unit += `- ${item.blockDescription} `;

        if (item.side)
            unit += `Ala ${item.side} `;

        unit += `${item.floor > 0 ? item.floor : ''} ${floorTypes[item.floorType]}`;

        return unit;
    }

    const unitColumns: IColumn<Unit>[] = [
        {
            id: 'code', label: 'Unidade', type: DataType.String, sortable: true, filterable: true, onCellRender: (data: Unit) => {
                return getUnitDescription(data);
            }
        },
        { id: 'floor', label: 'Nº do Andar', type: DataType.String, sortable: true, filterable: true, hidden: true },
        { id: 'floorType', label: 'Tipo de Andar', type: DataType.Enum, sortable: true, filterable: true, getOptions: getFloorTypeOptions, hidden: true },
        { id: 'block', label: 'Nº do Bloco', type: DataType.String, sortable: true, filterable: true, hidden: true },
        { id: 'blockDescription', label: 'Bloco', type: DataType.String, sortable: true, filterable: true, hidden: true },
        { id: 'side', label: 'Ala', type: DataType.String, sortable: true, filterable: true, hidden: true },
    ];

    const handleChoose = (items: string[]) => {

    }
    return (
        <CrudPage breadcrumbs={breadcrumbs}
            title='Lista de Pessoas' dataSource='/v1/people' columnKey='id'
            columns={columns}
            requestFields={requestFields}
            getRequest={getRequest} adaptRequest={adaptRequest} {...props}>

            <AppModal open={open} onClose={handleClose} onSubmit={handleSubmit}
                title={'Unidades'} fullScreen={isMobile} saving={saving} maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <UnitGroupSelect className={classes.unitGroupSelect} />

                        {storedUnitGroup && (
                            <AppTable
                                title="Unidades"
                                dataSource={`/v1/unit-groups/${storedUnitGroup.id}/units`}
                                columnKey="id"
                                columns={unitColumns} onChoose={handleChoose} chooseIcon={<DoneAllIcon />} />
                        )}
                    </Grid>
                    <Grid item xs={6} className={classes.rightColumn}>
                        <Typography variant="h6">Proprietário de:</Typography>
                        <List className={classes.root}>
                            {unitPagedList?.items.map((item, idx) => {
                                const unit = getUnitDescription(item);

                                return (
                                    <ListItem key={idx} className={classes.listItem}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {item.code}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={item.unitGroup.name} secondary={unit} />
                                    </ListItem>
                                );
                            })}

                        </List>
                    </Grid>
                </Grid>
            </AppModal>
        </CrudPage>
    );
}

export default withStyles(styles)(PersonPage);