import React, {useState} from "react";
import { View, Button } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

const DateTimePickerDefault = ({type, buttonTitle, dateKey, setValue}) =>{
    const [isDatePickerVisable, setDatePickerVisibility] = 
    useState(false);

    const showDatePicker=()=>{
        setDatePickerVisibility(true);
    }

    const hideDatePicker=()=>{
        setDatePickerVisibility(false);
    }

    const handleConfirm= (date) => {
        if(type === "time"){
            const hour = date.getHours();
            const minute =date.getMinutes();
            const formattedTime = `${hour}:${minute}`;
            setValue((prevState)=>({
                ...prevState, //mantém o estado atual
                [dateKey]: formattedTime
            }))
        } else{
            setValue((prevState)=>({
                ...prevState,
                [dateKey]:date, // date: aaaa:mm:dd
            }))
        }
        hideDatePicker();
    }

    return(
        <View>
            <Button title={buttonTitle} onPress={showDatePicker} color="#9d409c"/>
            <DateTimePicker
            isVisible={isDatePickerVisable}
            mode={type}
            locale="pt_BR"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            pickContainerStyleIOS={{backgoundColor:"fff"}}
            textColor="#000"
            />
        </View>
    )
}

export default DateTimePickerDefault;