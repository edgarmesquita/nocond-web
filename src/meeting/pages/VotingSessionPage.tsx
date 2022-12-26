import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { isMobile } from 'react-device-detect';
import { TextValidator } from 'react-material-ui-form-validator';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { RouteComponentProps } from "react-router-dom";
import { AppBreadcrumbs, AppLayout, AppModal } from "../../shared/components";
import { useApiService } from "../../config/axios.config";
import { PagedListResult, VotingSession, VotingSessionRequest, VotingTopic } from "../../models";
import { Avatar, Button, Card, CardActions, CardContent, CircularProgress, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Snackbar, Typography } from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import DeleteIcon from '@material-ui/icons/Delete';

import VotingTopicModal from "../components/VotingTopicModal";
import { VotingSessionService, VotingTopicService } from "../services";
import moment from "moment";
import 'moment/locale/pt-br';
import { Meeting } from "../models";
import { useSelector } from "react-redux";
import { getUnitGroup } from "../../store/unit/actions";
import { UnitGroup } from "../../unit/models";

moment.locale('pt-br');

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
        listDraggingOver: {
            backgroundColor: ""
        },
        item: {
            userSelect: 'none',
        },
        itemDraggingOver: {
            backgroundColor: ""
        }
    });

interface VotingSessionParams {
    meetingId: string;
}

type VotingSessionPageProps = {

} & WithStyles<typeof styles> & RouteComponentProps<VotingSessionParams>;

const VotingSessionPage = ({ classes, ...props }: VotingSessionPageProps) => {
    const storedUnitGroup = useSelector(getUnitGroup);
    const unitGroupId = storedUnitGroup?.id;

    const [sessionOpen, setSessionOpen] = useState(false);
    const [topicOpen, setTopicOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [response, error] = useApiService<PagedListResult<VotingSession>>(`/v1/meetings/${props.match.params.meetingId}/voting-sessions?pageIndex=${page + 1}&pageSize=${rowsPerPage}`);
    const [meeting, meetingError] = useApiService<Meeting>(unitGroupId ? `/v1/unit-groups/${unitGroupId}/meetings/${props.match.params.meetingId}` : null);
    const [items, setItems] = useState<VotingSession[] | null | undefined>(response?.items);
    const [topics, setTopics] = useState<VotingTopic[]>([{ id: '', text: '', duration: 0, answerLimit: 1, order: 0 }]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [currentVotingSessionId, setCurrentVotingSessionId] = useState<string | null>(null);

    const [startsOn, setStartsOn] = useState<Date | null>(null);
    const [endsOn, setEndsOn] = useState<Date | null>(null);

    const handleStartsOnChange = (date: Date | null) => {
        setStartsOn(date);
    };

    const handleEndsOnChange = (date: Date | null) => {
        setEndsOn(date);
    };

    const handleSessionOpen = () => {
        setSessionOpen(true);
    };

    const handleSessionClose = () => {
        setSessionOpen(false);
    };

    const handleTopicOpen = (votingSessionId: string) => () => {
        setCurrentVotingSessionId(votingSessionId);
        setTopicOpen(true);
    };

    const handleTopicClose = () => {
        setTopicOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const reorder = (list: VotingSession[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const reorderedList = reorder(
            [...items || []],
            result.source.index,
            result.destination.index
        );

        setItems(reorderedList);
    }

    const handleTopicChange = (topic: VotingTopic) => {

    }

    const showError = (message: string) => {
        setErrorMessage(message);
        setSnackbarOpen(true);
    }

    const handleSessionSubmit = async (e: React.FormEvent<Element>) => {
        const showErrorAndCancel = (message: string) => {
            showError(message);
            e.preventDefault();
        }

        if (!startsOn) {
            showErrorAndCancel('A data inicial deve ser definida.');
            return;
        }

        if (!endsOn) {
            showErrorAndCancel('A data final deve ser definida.');
            return;
        }

        const service = new VotingSessionService(props.match.params.meetingId);
        let id: string | null = null;
        try {
            id = await service.add({ startsOn, endsOn });
        }
        catch (err) {
            showErrorAndCancel('Ocorreu um erro ao inserir esta sessão');
            return;
        }

        if (id) {
            const sessions: VotingSession[] = items ? [...items] : [];
            sessions.push({ id, startsOn, endsOn });

            setCurrentVotingSessionId(id);
            setItems(sessions);
            setSessionOpen(false);
        }
    }

    const handleTopicSubmit = async (e: React.FormEvent<Element>, votingTopic?: VotingTopic) => {

        const showErrorAndCancel = (message: string) => {
            showError(message);
            e.preventDefault();
        }

        if (!currentVotingSessionId) {
            showErrorAndCancel('A sessão de voto deve ser definida.');
            return;
        }
        if (!votingTopic || !votingTopic.options || votingTopic.options.length === 0) {
            showErrorAndCancel('Uma opção de voto deve ser inserida.');
            return;
        }
        const service = new VotingTopicService(currentVotingSessionId);
        let id: string | null = null;
        try {
            id = await service.add({ ...votingTopic });
        }
        catch (err) {
            showErrorAndCancel('Ocorreu um erro ao inserir este tópico');
            return;
        }
        if (id) {
            let item: VotingTopic | null = null;

            try {
                item = await service.get(id);
            }
            catch (err) {
                votingTopic.id = id;
                item = votingTopic;
            }
            if (item) {
                var list = [...topics];
                list.push(item);
                setTopics(list);
            }
        }
        else {
            showErrorAndCancel('Ocorreu um erro ao inserir este tópico');
            return;
        }
    }

    useEffect(() => {
        if (response) {
            setItems(response.items);
        }
    }, [response]);

    return (
        <AppLayout {...props}>
            <AppBreadcrumbs gutterBottom items={[
                { name: 'Assembléias', icon: 'local_library' },
                { name: 'Ordens do Dia', path: '/voting-session', icon: 'chat' }
            ]} {...props} />

            {meeting && (<Typography variant="h6">{meeting.name} - Ordens do Dia</Typography>)}

            {meeting == null && meetingError == null && (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            )}
            {meetingError && (
                <Alert severity="error">{meetingError.message}</Alert>
            )}


            {meeting && items?.length === 0 && (
                <div className={classes.loading}>
                    Nenhuma sessão de voto cadastrada.
                </div>
            )}

            {meeting && items && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps}
                                ref={provided.innerRef} className={clsx({
                                    [classes.listDraggingOver]: snapshot.isDraggingOver
                                })}>
                                {items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps} className={clsx(classes.item, {
                                                    [classes.itemDraggingOver]: snapshot.isDragging
                                                })}
                                                style={provided.draggableProps.style}>
                                                <Card>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                    {index + 1}ª Ordem do Dia
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    Começa em: {moment(item.startsOn).format('lll')}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" component="p">
                                                                    Termina em: {moment(item.endsOn).format('lll')}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                {item.topics && (
                                                                    <List dense>
                                                                        {item.topics.map((topic, idx) => (
                                                                            <ListItem key={idx} className={classes.listItem}>
                                                                                <ListItemAvatar>
                                                                                    <Avatar>
                                                                                        <ListIcon />
                                                                                    </Avatar>
                                                                                </ListItemAvatar>
                                                                                <ListItemText primary={topic.text} />
                                                                                <ListItemSecondaryAction>
                                                                                    <IconButton edge="end" aria-label="delete">
                                                                                        <DeleteIcon />
                                                                                    </IconButton>
                                                                                </ListItemSecondaryAction>
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                )}

                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button size="small" color="primary" onClick={handleTopicOpen(item.id)}>
                                                            Adicionar Tópico
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
            {meeting && (
                <React.Fragment>
                    <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleSessionOpen}>
                        <AddIcon />
                    </Fab>
                    <AppModal title="Sessão de Voto" open={sessionOpen}
                        onClose={handleSessionClose} fullScreen={isMobile} onSubmit={handleSessionSubmit}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="startsOnDate"
                                        label="Começa em"
                                        format="dd/MM/yyyy"
                                        inputVariant="outlined"
                                        value={startsOn}
                                        onChange={handleStartsOnChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'começa em',
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="startsOnTime"
                                        label="às"
                                        inputVariant="outlined"
                                        value={startsOn}
                                        onChange={handleStartsOnChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'começa às',
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="endsOnDate"
                                        label="Termina em"
                                        format="dd/MM/yyyy"
                                        inputVariant="outlined"
                                        value={endsOn}
                                        onChange={handleEndsOnChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'termina em',
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={6}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="endsOnTime"
                                        label="às"
                                        inputVariant="outlined"
                                        value={endsOn}
                                        onChange={handleEndsOnChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'termina às',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </AppModal>
                </React.Fragment>
            )}

            {currentVotingSessionId && (
                <VotingTopicModal
                    open={topicOpen} votingSessionId={currentVotingSessionId}
                    onClose={handleTopicClose}
                    onAdd={handleTopicChange} onSubmit={handleTopicSubmit} />
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
}

export default withStyles(styles)(VotingSessionPage);