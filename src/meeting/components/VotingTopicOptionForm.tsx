import React, { useState } from "react";
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    StyleRules
} from "@material-ui/core/styles";
import {
    Box, Button, FormControl, FormControlLabel, FormGroup,
    FormHelperText, Grid, Switch, Typography
} from "@material-ui/core";
import { VotingTopicOption, VotingTopicOptionRequest, VotingTopicOptionType } from "../../models";

const styles: (theme: Theme) => StyleRules<string> = theme =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawerFooter: {
            textAlign: 'right',
        }
    });

type VotingTopicOptionFormProps = {
    label?: string,
    editable?: boolean,
    isFillableOption?: boolean,
    onAdd?: (option: VotingTopicOption) => void,
    onUpdate?: (option: VotingTopicOption) => void
} & WithStyles<typeof styles>;


const VotingTopicOptionForm = ({ classes, onAdd, onUpdate, ...props }: VotingTopicOptionFormProps) => {
    const [label, setLabel] = useState<string | undefined>(props.label);
    const [editable, setEditable] = useState<boolean | undefined>(props.editable);

    function handleChange<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setState(event.target.value as any);
        };
    }

    const handleEditableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditable(event.target.checked);
    };

    const handleSubmit = (e: React.FormEvent<Element>) => {
        if (onAdd)
            onAdd({
                id: "",
                label: label || '',
                editable: editable || false,
                type: VotingTopicOptionType.Undefined,
                isFillableOption: false
            });

    }
    return (
        <Box pt={2} pb={2}>
            <ValidatorForm onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>Opção de Voto</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextValidator fullWidth multiline
                            rowsMax={4} label="Texto" helperText="Texto que define a opção de voto"
                            validators={['required']} errorMessages={['O texto é obrigatório']} value={label}
                            id={'label'} name={'label'} variant="outlined" onChange={handleChange(setLabel)} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <FormControl component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={editable} onChange={handleEditableChange} color="primary" name="editable" />}
                                    label="Editável"
                                />
                            </FormGroup>
                            <FormHelperText>Pode ser alterado às vésperas da votação</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={2} className={classes.drawerFooter}>
                        <Button type="submit" variant="contained" color="primary"
                            className={classes.button}>
                            Adicionar
                        </Button>
                    </Grid>
                </Grid>
            </ValidatorForm>
        </Box>
    );
}

export default withStyles(styles)(VotingTopicOptionForm);