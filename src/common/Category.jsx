import { StyleSheet, View, Text, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';

import CategoryButtons from '../atoms/CategoryButtons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WHITE } from '../styles/colors';
import { getResponsiveValue } from '../styles/responsive';
import stringsoflanguages from '../utils/ScreenStrings';
import { FETCH } from '../services/fetch';
import { useLocal } from '../context/ProfileContext';
import CustomModal from '../atoms/CustomModal';

const Category = (props) => {

    const { localState, localDispatch } = useLocal()
    const [category, setCategory] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        navigationPage: '',
        onClose: null
    })
    
    useEffect(() => {
        setCategory(localState.category);
    }, [localState.category]);

    const data = [];
    for (let i = 0; i < category.length; i += 9) {
        data.push(category.slice(i, i + 9));
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container1} >
        {showModal ? <CustomModal visible={modal.visible} message={modal.message} navigationPage={modal.navigationPage} onClose={modal.onClose} /> : ''}
                <View style={styles.Container2}>
                <FlatList
                data={data}
                horizontal
                pagingEnabled // Scroll by screen width
                keyExtractor={(item, index) => `page-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.page}>
                        {item.map((el) => (
                            <CategoryButtons text={el.type} key={el._id} />
                        ))}
                    </View>
                )}
            />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    container1: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        left: getResponsiveValue("2%", "2%"),
    },
    Container2: {
        backgroundColor: WHITE,
        flexWrap: "wrap",
        flexDirection: "row",
        maxWidth: "95%",
        justifyContent: "flex-start",
    },
    page: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: Dimensions.get('window').width, // Screen width
    },
});

export default Category;