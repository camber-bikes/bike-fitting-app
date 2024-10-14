import { Alert, Text, Button, StyleSheet, KeyboardAvoidingView, TextInput, View, ProgressBarAndroid } from "react-native";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { PersonContext } from "@/app/index";
import { ScanContext } from "@/app/index";

export default function PersonInformationScreen() {
    const navigation = useNavigation();
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const isButtonDisabled = !input1 || !input2;
    const { person } = useContext(PersonContext);
    const { scan_uuid, updateScanUUID } = useContext(ScanContext);

    const BASE_URL = 'https://backend-489080704622.us-west2.run.app/api/';

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
            Alert.alert('Success', 'Person form submitted successfully!');
            person.uuid = person_data.uuid;

            const scan_response = await fetch(BASE_URL + 'scans/', {
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
            updateScanUUID(scan_data.scan_uuid);
            navigation.navigate("tutorial");
        } catch (error) {
            Alert.alert('Error', 'Failed to submit form');
            console.error('Error:', error);
        }
    };

    return (
        <KeyboardAvoidingView>
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* Top section: Question */}
            <Text style={styles.questionText}>Wie heisst du?</Text>

            {/* Input field for Name */}
            <TextInput
                style={styles.input}
                placeholder="Namen"
                value={input1}
                onChangeText={setInput1}
                keyboardType="default"
                placeholderTextColor="#999"
            />

            {/* Question for height */}
            <Text style={styles.questionText}>Wie gross bist du?</Text>

            {/* Input field for height */}
            <TextInput
                style={styles.input}
                placeholder="Größe in cm"
                value={input2}
                onChangeText={setInput2}
                keyboardType="numeric"
                placeholderTextColor="#999"
            />

            {/* Submit button */}
            <Button
                onPress={handleSubmit}
                title="Weiter"
                color="#de78b2"
                disabled={isButtonDisabled}
            />
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 15,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
    },
});