import React, { ReactNode } from "react";
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";

import moment from 'moment';
import {
    Avatar, Button, Card, CardActions, CardContent, CardHeader,
    ClickAwayListener, Divider, Grow, IconButton, ListItemIcon, ListItemText, MenuItem,
    MenuList, Paper, Popper, Tooltip, Typography
} from "@material-ui/core";

import Rating, { IconContainerProps } from '@material-ui/lab/Rating';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

import { Meeting } from "../models";
import 'moment/locale/pt-br';
import { RouteComponentProps } from "react-router-dom";

moment.locale('pt-br');

const customIcons: { [index: string]: { icon: React.ReactElement; label: string } } = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Muito insatisfeito',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Insatisfeito',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutro',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfeito',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Muito Satisfeito',
    },
};
function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        card: {
            minHeight: "220px",
            display: "flex",
            flexDirection: "column",
        },
        cardContent: {
            flex: 1
        },
        avatar: {
            backgroundColor: theme.palette.primary.main
        },
        popper: {
            zIndex: 1000
        },
        paper: {
            marginRight: theme.spacing(2),
        },
        middle: {
            flexGrow: 1
        }
    });

type MeetingCardProps = {
    item: Meeting
    children?: ReactNode
} & WithStyles<typeof styles> & RouteComponentProps;

const MeetingCard = ({ classes, item, history, children }: MeetingCardProps) => {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const handleInviteClick = (meetingId: string) => (event: React.MouseEvent<EventTarget>) => {
        handleClose(event);
    }
    const handleVotingSessionClick = (meetingId: string) => (event: React.MouseEvent<EventTarget>) => {
        handleClose(event);
        history.push(`/meetings/${meetingId}/voting-sessions`);
    }

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {item.type.name}
                    </Avatar>
                }
                action={
                    <React.Fragment>
                        <IconButton aria-label="settings"
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}>
                            <MoreVertIcon />
                        </IconButton>
                        <Popper open={open} placement="bottom-end"
                            anchorEl={anchorRef.current} role={undefined}
                            transition disablePortal
                            className={classes.popper}>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement.startsWith('bottom') ? 'right top' : 'center bottom' }}>
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                <MenuItem onClick={handleInviteClick(item.id)}>
                                                    <ListItemIcon>
                                                        <PersonAddIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Convidar" />
                                                </MenuItem>
                                                <MenuItem onClick={handleVotingSessionClick(item.id)}>
                                                    <ListItemIcon>
                                                        <HowToVoteIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Votações" />
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem onClick={handleClose}>
                                                    <ListItemIcon>
                                                        <DeleteIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Cancelar" />
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </React.Fragment>
                }
                title={item.name}
                subheader={moment(item.startsOn).format('LLL')}
            />
            <CardContent className={classes.cardContent}>
                <Typography variant="body2" color="textSecondary" component="p">
                    {item.description}
                </Typography>

            </CardContent>
            <CardActions disableSpacing>
                <Button size="small" color="primary">
                    Participantes
                </Button>
                <div className={classes.middle} />
                <Tooltip title={<React.Fragment>
                    Nível de satisfação dos participantes:<br />
                    {customIcons[2].label}
                </React.Fragment>} placement="top-end">
                    <div>
                        <Rating readOnly size="small"
                            name="meeting-feedback"
                            defaultValue={2}
                            getLabelText={(value: number) => customIcons[value].label}
                            IconContainerComponent={IconContainer}
                        />
                    </div>
                </Tooltip>
            </CardActions>
        </Card>
    );
}

export default withStyles(styles)(MeetingCard);