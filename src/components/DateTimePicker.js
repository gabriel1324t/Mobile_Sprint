import React, { useState } from "react";
import { View, Button } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

const DateTimePickerDefault = ({ type, buttonTitle, dateKey, setValue, currentValue }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setValue((prevState) => ({
      ...prevState,
      [dateKey]: date,
    }));
    hideDatePicker();
  };

  return (
    <View>
      <Button
        title={
          currentValue
            ? new Date(currentValue).toLocaleString("pt-BR")
            : buttonTitle || "Selecionar data e hora"
        }
        onPress={showDatePicker}
        color="red"
      />
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode={type}
        locale="pt_BR"
        is24Hour={true}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={currentValue ? new Date(currentValue) : new Date()}
        textColor="#000"
      />
    </View>
  );
};

export default DateTimePickerDefault;
