import React, { } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
const constants = require('../components/constants.json')

import Header from '../components/Header';

const PrivacyPolicyScreen = ({ navigation, }) => {

    return (
        <>
            <View style={styles.container}>
                <Text style={[styles.textDefaultBold, styles.title]}>TimeOut Privacy Policy</Text>

                <Text style={[styles.textDefaultSemiBold, styles.title, { fontSize: 16, }]}>Last updated {constants['privacyPolicyLastUpdated']}</Text>

                <ScrollView style={{ marginBottom: 100, marginTop: 10, }}>

                    <Text style={[styles.textDefaultSemiBold, styles.subHeader,]}>Privacy Policy Overview</Text>
                    <Text style={[styles.regularText]}>
                        nofuss.exe built TimeOut as a free app, with potential ad integration in the future. This app is provided by nofuss.exe at no cost and is intended for use as is.

                        This page is used to comply with legal requirements and to inform users regarding policies with the collection, use, and disclosure of personal Information for anyone using this app.

                        By using this app, you agree to the collection and use of information in relation to this policy. We will not use or share your information with anyone except as described in this Privacy Policy.

                        The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at TimeOut unless otherwise defined in this Privacy Policy.
                    </Text>

                    <Text style={[styles.textDefaultSemiBold, styles.subHeader,]}>Information Collection and Use</Text>
                    <Text style={[styles.regularText]}>
                        While using TimeOut, we may require you to provide us with certain personally identifiable information, including but not limited to first name, last name, and email. This information is
                        securely stored, and we do not share this information with any third parties nor do we profit from the information in any way.
                    </Text>

                    <Text style={[styles.textDefaultSemiBold, styles.subHeader,]}>Log Data</Text>
                    <Text style={[styles.regularText]}>During the use of this app, in the case of loss of connection or wifi, data may be stored on your phone.
                        This data may include information such as your IP address, device name, operating system version, configuration of the app at the time,
                        the current time and date, and other statistics.
                        During normal use of the app, various information may be cached on your device, such as task history, user preferences, and profile avatars.
                    </Text>
                    <Text style={[styles.textDefaultSemiBold, styles.subHeader,]}>Links to Other Sites</Text>
                    <Text style={[styles.regularText]}>
                        This app may or may not contain links to other sites. By clicking on a third-party link, you will be directed to that site. External sites are not
                        operated by noFuss.exe and we do not assume any control or responsibility for the content, privacy policies, or practices of any third-party sites or services.

                    </Text>

                    <Text style={[styles.textDefaultSemiBold, styles.subHeader,]}>Changes to This Privacy Policy</Text>
                    <Text style={[styles.regularText]}>
                        We may update our privacy policy from time to time. Changes can be found here, as well as in the app store listing.
                    </Text>

                    <Text style={[styles.textDefaultSemiBold, styles.subHeader,]}>Contact Us</Text>
                    <Text style={[styles.regularText]}>
                        If you have any questions or suggestions about this policy or anything related to TimeOut,
                        please contact us at exe@nofuss.xyz</Text>
                </ScrollView>



            </View>

            <Header
                navigation={navigation}
                color={'#67806D'} />
        </>

    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        marginTop: 110,
        marginHorizontal: 30,
    },
    title: {
        fontSize: 24,
        color: '#67806D',
    },
    subHeader: {
        fontSize: 16,
        marginBottom: 6,
        marginTop: 15,
        color: '#67806D',
    },
    regularText: {
        color: 'black',
    }
})

export default PrivacyPolicyScreen;