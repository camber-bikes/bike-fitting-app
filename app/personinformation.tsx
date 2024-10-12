import {Alert, Button, Pressable, StyleSheet, TextInput, View} from "react-native";
import React, {useState} from "react";
import {useNavigation} from '@react-navigation/native';

export default function PersoninformationScreen() {
    const navigation = useNavigation();
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const isButtonDisabled = !input1 || !input2;

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://backend-489080704622.us-west2.run.app/api/persons/informationt', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: input1,
                    height_cm: input2,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            Alert.alert('Success', 'Form submitted successfully!');
            console.log(data);
            navigation.navigate("tutorial")
        } catch (error) {
            Alert.alert('Error', 'Failed to submit form');
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.formContainer}>
            <p>Enter your username:</p>
            <TextInput
                style={styles.input}
                value={input1}
                onChangeText={setInput1}
                keyboardType="text"
            />
            <p>Enter your height in cm</p>
            <TextInput
                style={styles.bottomInput}
                value={input2}
                onChangeText={setInput2}
                keyboardType="numeric"
            />
            <Button
                onPress={handleSubmit}
                children={undefined}
                title={"Submit"}
                color={"#de78b2"}
                disabled={isButtonDisabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        margin: "3%"
    },
    input: {
        width: "100%",
        padding: "2%",
        borderStyle: "solid",
        borderWidth: "2px",
        borderColor: "gray",
        borderRadius: 15
    },
    bottomInput: {
        width: "100%",
        padding: "2%",
        borderStyle: "solid",
        borderWidth: "2px",
        borderColor: "gray",
        borderRadius: 15,
        marginBottom: "10%"
    }
});