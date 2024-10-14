import {Alert, Button, StyleSheet, TextInput, View, Text} from "react-native";
import React, {useState} from "react";
import {useNavigation} from '@react-navigation/native';
import { useContext } from 'react';
import {PersonContext} from "@/app/index";
import {ScanContext} from "@/app/index";

export default function PersoninformationScreen() {
    const navigation = useNavigation();
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const isButtonDisabled = !input1 || !input2;
    const { person } = useContext(PersonContext);
    const { scan_uuid, updateScanUUID } = useContext(ScanContext);

    const BASE_URL = 'https://backend-489080704622.us-west2.run.app/api/'

    const handleSubmit = async () => {
        try {
            const person_response = await fetch(BASE_URL + 'persons/information', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: input1,
                    height_cm: input2,
                }),
            });
            const person_data = await person_response.json();
            Alert.alert('Success', 'Personform submitted successfully!');
            person.uuid = person_data.uuid

            const scan_response = await fetch( BASE_URL + 'scans/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    person_uuid: person.uuid,
                }),
            });
            const scan_data = await scan_response.json();
            Alert.alert('Success', 'Scan_id fetched successfully!');
            updateScanUUID(scan_data.scan_uuid)
            navigation.navigate("recordPhoto")
        } catch (error) {
            Alert.alert('Error', 'Failed to submit form');
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text>Enter your username:</Text>
            <TextInput
                style={styles.input}
                value={input1}
                onChangeText={setInput1}
                keyboardType="text"
            />
            <Text>Enter your height in cm</Text>
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