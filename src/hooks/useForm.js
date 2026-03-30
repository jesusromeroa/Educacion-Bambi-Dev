import { useState } from "react";

export const useForm = (initialForm = {}) => {

    const [formState, setformState] = useState(initialForm);
    
        const onInputChange = ({target}) => {
            const {name, value} = target;
            setformState({
                ...formState,
                [name]: value
            });
        };

        const onResetForm = () => {
            const emptyState = {};
            Object.keys(formState).forEach( (name) => {
                emptyState[name] = '';
            });
            setformState(emptyState);
            //lietralmente para esto podia haber hecho
            //setFormState(initialValue)
            //pero bueno yo y la esquizofrenia
        }

    return ({
        formState,
        onInputChange,
        onResetForm
    });
}