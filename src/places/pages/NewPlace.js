import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { create_place } from '../../assets/js/apiEndPoints';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import './PlaceForm.css';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const [formState, inputChangeHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    },false);
    const { isLoadingSpinner, error, sendRequest, clearError } = useHttpClient();
    const history = useHistory();
    
    const formSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(create_place, 'POST', {
                Authorization: 'Bearer ' + auth.token
            }, formData);
            history.push(`/${auth.userId}/places`);
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <form className="place-form" onSubmit={formSubmitHandler}>
                {isLoadingSpinner && <LoadingSpinner asOverlay />}
                {error && <ErrorModal  error={error} onClear={clearError}/>}
                <Input 
                    id="title" 
                    label="Title"  
                    type="text" 
                    element="input" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText='Please enter the valid text'
                    onInput={inputChangeHandler}
                />
                <Input 
                    id="description" 
                    label="Description"  
                    element="textarea" 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText='Please enter the valid description (atleast 5 characters)'
                    onInput={inputChangeHandler}
                />
                <ImageUpload 
                    id="image" 
                    center 
                    onInput={inputChangeHandler} 
                />
                <Input 
                    id="address" 
                    type="text"
                    label="Address"  
                    element="input" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText='Please enter the valid address'
                    onInput={inputChangeHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;