import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from "react-router-dom";

import "./PlaceForm.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { 
    VALIDATOR_REQUIRE, 
    VALIDATOR_MINLENGTH 
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { get_place_by_id, update_place } from "../../assets/js/apiEndPoints";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
    const placeId = useParams().placeId;
    const auth = useContext(AuthContext);
    const history = useHistory();

    const [formState, inputChangeHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    const { isLoadingSpinner, error, sendRequest, clearError } = useHttpClient();

    const [ loadedPlace, setLoadedPlace ] = useState();

    useEffect(() => {
        const fetchPlaces = (async () => {
            try {
                const responseData = await sendRequest(get_place_by_id + '?' + new URLSearchParams({
                    pid: placeId
                }));
                setLoadedPlace(responseData.data);
                setFormData({
                    title: {
                        value: responseData.data.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.data.description,
                        isValid: true
                    }
                },true);
            } catch(err) {}
        });
        fetchPlaces();
    }, [sendRequest, placeId, setFormData])

    if(isLoadingSpinner){
        return (
            <div className="center">
                <LoadingSpinner asOverlay/>
            </div>
        );
    }

    if(!loadedPlace && !error){
        return (
            <div className="center">
                <h2>Cant Find Place</h2>
            </div>
        );
    }

    const formSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(update_place, 'POST', { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth.token
            }, JSON.stringify({
                id: placeId,
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }));
            history.push(`/${auth.userId}/places`)
        } catch (err) {}
    };

    return (
        <React.Fragment>
            {<ErrorModal error={error} onClear={clearError}/>}
            {!isLoadingSpinner && loadedPlace && <form className="place-form" onSubmit={formSubmitHandler}>
                <Input 
                    id="title" 
                    label="Title"  
                    type="text" 
                    element="input" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText='Please enter the valid text'
                    onInput={inputChangeHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true}
                />
                <Input 
                    id="description" 
                    label="Description"  
                    element="textarea" 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText='Please enter the valid description (atleast 5 characters)'
                    onInput={inputChangeHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>}
        </React.Fragment>
    );
};

export default UpdatePlace;