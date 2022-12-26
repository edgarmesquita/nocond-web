import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import MaskedInput, { maskArray } from 'react-text-mask';
import { FormControl, FormHelperText, Input, InputLabel, OutlinedInput } from '@material-ui/core';

interface TextMaskCustomProps {
    mask?: maskArray | ((value: string) => maskArray);
    inputRef: (ref: HTMLInputElement | null) => void;
}

const TextMaskCustom = (props: TextMaskCustomProps) => {
    const { inputRef, mask, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={mask}
            placeholderChar={'_'}
            showMask
        />
    );
}

export default class MaskedTextValidator extends ValidatorComponent {
    renderValidatorComponent() {

        const {
            error,
            errorMessages,
            validators,
            requiredError,
            helperText,
            validatorListener,
            withRequiredValidator,
            containerProps,
            id,
            name,
            mask,
            label,
            fullWidth,
            variant,
            value,
            ...rest
        } = this.props;
        const { isValid } = this.state as any;

        const customHelperText = (!isValid && this.getErrorMessage()) || helperText;
        const CustomInput = variant === 'outlined' ? OutlinedInput : Input;
        return (
            <FormControl fullWidth error={!isValid || error} variant={variant} {...rest}>
                {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
                <CustomInput id={id} name={name} label={label} value={value}
                    inputProps={{ mask: mask }}
                    inputComponent={TextMaskCustom as any}
                />
                {customHelperText && <FormHelperText id={id}>{customHelperText}</FormHelperText>}
            </FormControl>
        );
    }
}