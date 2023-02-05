import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { compareAsc, eachDayOfInterval, format, subDays, addDays } from 'date-fns';
import DateDetail from './DateDetail';

const DateList = ({ dates_to_display, updateCallback, navigation }) => {

    return (
        <View style={styles.container}>
            <FlatList
                horizontal={true}
                data={dates_to_display}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result}
                renderItem={({ item }) => {
                    item = format(item, 'M-dd-yyyy');
                    return (
                        <DateDetail result={item}
                            updateCallback={updateCallback}>

                        </DateDetail>
                    )
                }}
            >


            </FlatList>

        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 50,
    },
})

export default DateList;