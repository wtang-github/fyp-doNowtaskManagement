import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list';
import { useOverlay } from '../utility/helperFunctions';

const TagDropdown = ({ uid, select, defaultTag }) => {
    const [tags, setTags] = useState([]);
    const [selectTag, setSelectTag] = useState(null);
    const [newTagName, setNewTagName] = useState('');
    const { isOverlayVisible, toggleOverlay } = useOverlay();

    const dropdownData = [
        ...tags,
        { key: 'add-new-tag', value: 'Add New Tag' },
    ];

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagSnapshot = await firestore()
                    .collection('users')
                    .doc(uid)
                    .collection('tags')
                    .get();
                const fetchedTags = tagSnapshot.docs.map(doc => ({
                    key: doc.id,
                    value: doc.data().name
                }));
                setTags(fetchedTags);

                if (defaultTag) {
                    const tag = fetchedTags.find(tag => tag.value === defaultTag);
                    setSelectTag(tag ? tag.key : null);
                }
            } catch (error) {
                console.error('Error fetching tags: ', error);
            }
        };

        fetchTags();
    }, [uid, defaultTag]);

    const addNewTag = async () => {
        if (newTagName.trim().length > 0) {
            try {
                await firestore()
                    .collection('users')
                    .doc(uid)
                    .collection('tags')
                    .add({ name: newTagName });
                
                const updatedTags = await firestore()
                    .collection('users')
                    .doc(uid)
                    .collection('tags')
                    .get();
                const fetchedTags = updatedTags.docs.map(doc => ({
                    key: doc.id,
                    value: doc.data().name
                }));
                setTags(fetchedTags);
                setNewTagName('');
                toggleOverlay(); 
            } catch (error) {
                console.error('Error adding new tag: ', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <SelectList
                setSelected={(val) => {
                    if (val === 'Add New Tag') {
                        toggleOverlay(); 
                    } else {
                        setSelectTag(val); 
                        select(val); 
                    }
                }}
                data={dropdownData}
                save="value"
                placeholder='Tags'
                defaultOption={tags.find(tag => tag.key === selectTag)}
                dropdownTextStyles={{ fontSize: 13 }}
                maxHeight={80}
                boxStyles={{ height: 42 }}
                dropdownItemStyles={{ borderBottomWidth: 1 }}
            />

            <Modal isVisible={isOverlayVisible} onBackdropPress={toggleOverlay}>
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter tag name"
                        value={newTagName}
                        onChangeText={setNewTagName}
                    />
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={addNewTag} style={styles.addButton}>
                            Add Tag
                        </Button>
                        <Button mode="outlined" onPress={toggleOverlay} style={styles.cancelButton} theme={{ colors: { outline: 'red', primary: 'red' } }}>
                            Cancel
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#003066',
    },
    cancelButton: {
        flex: 1,
    },
});

export default TagDropdown;
