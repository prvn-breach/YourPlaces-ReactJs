import React, { useState, useContext } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { 
    VALIDATOR_EMAIL, 
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { login, signup } from "../../assets/js/apiEndPoints";
import { useHttpClient } from "../../shared/hooks/http-hook";

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoadingSpinner, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputChangeHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        }
    },false);

    const switchModeHandler = () => {
        if (!isLoginMode) {
           setFormData({
               ...formState.inputs,
               name: undefined,
               image: undefined
           }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authenticationSubmitHandler = async event => {
        event.preventDefault();
        if(isLoginMode) {
            try {
                const responseData = await sendRequest(login, 'POST', { 'Content-Type': 'application/json' }, JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                )

                const { userId, token } = responseData;
                auth.login(userId, token);
            } catch(err) {}
        } else {
            try {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(signup, 'POST', {}, formData);

                const { userId, token } = responseData;
                auth.login(userId, token);
            } catch (err) {}
        }
    };

    return (
        <Card className="authentication">
            {isLoadingSpinner && <LoadingSpinner asOverlay />}
            {error && <ErrorModal  error={error} onClear={clearError}/>}
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={authenticationSubmitHandler}>
                {!isLoginMode && <Input 
                                    element="input" 
                                    id="name" 
                                    label="Your Name" 
                                    type="text" 
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter your name."
                                    onInput={inputChangeHandler}
                                />
                }
                {!isLoginMode && <ImageUpload 
                                    id="image" 
                                    onInput={inputChangeHandler}
                                    center 
                                />
                }
                <Input
                    element="input"
                    id="email"
                    label="E-mail"
                    type="text"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter valid email address."
                    onInput={inputChangeHandler}
                />
                <Input
                    element="input"
                    id="password"
                    label="Password"
                    type="password"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter atleast 5 characters."
                    onInput={inputChangeHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    { isLoginMode ? 'LOGIN' : 'SIGNUP' }
                </Button>
                <Button type="button" inverse onClick={switchModeHandler}>
                    GO TO { isLoginMode ? 'SIGNUP' : 'LOGIN' }
                </Button>
            </form>
        </Card>
    );
};

export default Auth;