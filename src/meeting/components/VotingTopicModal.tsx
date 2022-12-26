import React, { useState } from "react";
import { TextValidator } from 'react-material-ui-form-validator';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { isMobile } from 'react-device-detect';
import { AppBar, Avatar, Container, Grid, Icon, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, SwipeableDrawer, Toolbar, Tooltip, Typography } from "@material-ui/core";
import { VotingTopic, VotingTopicOption, VotingTopicOptionRequest } from "../../models";

import VotingTopicOptionForm from "./VotingTopicOptionForm";
import { AppModal } from "../../shared/components";

import AddIcon from '@material-ui/icons/Add';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List'
    ;
const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        container: {
            flexGrow: 1,
            [theme.breakpoints.down('xs')]: {

            },
        },
        rightColumn: {
            position: 'relative',
            backgroundColor: '#DDD',
            paddingTop: `${theme.spacing(6)}px !important`,
            margin: `-${theme.spacing(1)}px -${theme.spacing(1)}px -${theme.spacing(1)}px ${theme.spacing(1)}px`,
            flexGrow: 1,
            minHeight: '280px',
            [theme.breakpoints.down('xs')]: {
                margin: theme.spacing(1),
            },
        },
        appBar: {
            top: 0,
            bottom: 'auto',
        },
        title: {
            flexGrow: 1
        },
        listItem: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            marginBottom: theme.spacing(1)
        }
    });

type VotingTopicModalProps = {
    votingSessionId: string,
    open: boolean,
    onClose: () => void,
    onAdd: (votingTopic: VotingTopic) => void,
    onSubmit?: (e: React.FormEvent<Element>, votingTopic?: VotingTopic) => void,
} & WithStyles<typeof styles>;


const VotingTopicModal = ({ classes, votingSessionId, open, onAdd, onClose, onSubmit }: VotingTopicModalProps) => {

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [order, setOrder] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [answerLimit, setAnswerLimit] = useState<number>(1);
    const [options, setOptions] = useState<VotingTopicOption[]>([]);
    const [addPeople, setAddPeople] = useState<boolean>(false);

    function handleChange<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setState(event.target.value as any);
            onAdd({ id: "", introduction, text, order, duration, answerLimit });
        };
    }

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };
    const handleAdd = (option: VotingTopicOption) => {
        const list = [...options];
        list.push(option);

        setOptions(list);
        setDrawerOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<Element>) => {
        if (onSubmit) onSubmit(e, { id: "", introduction, text, order, duration, answerLimit, options });
    }

    return (
        <React.Fragment>
            <AppModal open={open} onClose={onClose} title="Sessão de Voto"
                fullScreen={isMobile} maxWidth={'xl'} onSubmit={handleSubmit}>
                <Grid container spacing={2} className={classes.container}>
                    <Grid item xs={12} sm={8} lg={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextValidator fullWidth multiline
                                    rowsMax={4} label="Introdução" helperText="Texto introdutório opcional"
                                    validators={[]} errorMessages={[]} value={introduction}
                                    id={`introduction${order}`} name={`introduction${order}`} variant="outlined" onChange={handleChange(setIntroduction)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextValidator fullWidth multiline
                                    rowsMax={4} label="Texto" helperText="Texto que define um questionamento"
                                    validators={['required']} errorMessages={['O texto é obrigatório']} value={text}
                                    id={`text${order}`} name={`text${order}`} variant="outlined" onChange={handleChange(setText)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextValidator fullWidth label="Duração (segundos)" helperText="Tempo máximo para votação"
                                    type="number" InputProps={{ inputProps: { min: 1, max: 600 } }}
                                    validators={['required']} errorMessages={['A duração é obrigatória']} value={duration}
                                    id={`duration${order}`} name={`duration${order}`} variant="outlined" onChange={handleChange(setDuration)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextValidator fullWidth label="Limite de respostas" type="number" InputProps={{ inputProps: { min: 1, max: 600 } }}
                                    validators={['required']} errorMessages={['O limite de resposta é obrigatório']} value={answerLimit}
                                    id={`answerLimit${order}`} name={`duration${order}`} variant="outlined" onChange={handleChange(setAnswerLimit)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} lg={6} className={classes.rightColumn}>
                        <AppBar position="absolute" color="secondary" className={classes.appBar}>
                            <Toolbar variant="dense">
                                <Typography variant="h6" color="inherit" className={classes.title}>
                                    Opções
                                </Typography>

                                <Tooltip title="Adicionar resposta">
                                    <IconButton aria-label="adicionar" color="inherit" onClick={toggleDrawer(true)}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Adicionar pessoas">
                                    <IconButton aria-label="adicionar" color="inherit">
                                        <PersonAddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        </AppBar>

                        <List dense>
                            {options.map((option, idx) => (
                                <ListItem key={idx} className={classes.listItem}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ListIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={option.label} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </AppModal>
            <SwipeableDrawer
                anchor={'bottom'}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}>
                <Container>
                    <VotingTopicOptionForm onAdd={handleAdd} />
                </Container>
            </SwipeableDrawer>
        </React.Fragment>
    );
}

export default withStyles(styles)(VotingTopicModal);