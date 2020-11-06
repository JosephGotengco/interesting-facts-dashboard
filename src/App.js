import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./css/font.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import {
    AppContainer,
    AppSection,
    AppSectionHeader,
    StatLabel,
    StatValue,
    Logo,
    HeaderWrapper,
    ContentWrapper,
    TitleText,
    SubTitle,
} from "./css/styles";

// configure dayjs to prep for converting UTC to PST
dayjs.extend(utc);
dayjs.extend(timezone);
// configure datjs to use month names
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
});

const BASE_URL = "http://kafka-service-based.westus2.cloudapp.azure.com";
const PROCESSING_URL = `${BASE_URL}:8100`;
const AUDIT_LOG_URL = `${BASE_URL}:9999`;

function App() {
    const [stats, setStats] = useState({});
    const [user, setUser] = useState({});
    const [fact, setFact] = useState({ tags: [] });

    const getStats = async () => {
        try {
            const response = await axios.get(`${PROCESSING_URL}/stats`);

            // console.log for grading/debugging
            console.log("STATS:", response.data);

            // convert datetime to PST
            const datetime = response.data.datetime;
            response.data.datetime = dayjs(datetime)
                .tz("America/Vancouver")
                .format("MMMM DD, YYYY - HH:mm:ss");

            setStats(response.data);
        } catch (e) {}
    };

    const getFacts = async () => {
        try {
            const response = await axios.get(`${AUDIT_LOG_URL}/facts?index=1`);
            const data = response.data;

            // convert datetime to PST
            data.datetime = dayjs(data.datetime)
                .tz("America/Vancouver")
                .format("MMMM DD, YYYY - HH:mm:ss");

            // make object one level deep
            const factData = {
                ...data,
                ...data.payload,
            };
            delete factData.payload;

            // console.log for grading/debugging
            console.log("FACT:", factData);
            setFact(factData);
        } catch (e) {
            console.error("Error calling fact endpoint, verify there is data");
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.get(`${AUDIT_LOG_URL}/users?index=1`);
            const data = response.data;
            
            // convert datetime to PST
            data.datetime = dayjs(data.datetime)
                .tz("America/Vancouver")
                .format("MMMM DD, YYYY - HH:mm:ss");

            // make object one level deep
            const userData = {
                ...data,
                ...data.payload,
            };
            delete userData.payload;

            // console.log for grading/debugging
            console.log("USER:", userData);
            setUser(userData);
        } catch (e) {
            console.error("Error calling user endpoint, verify there is data");
        }
    };

    const getData = useCallback(async () => {
        // call all three functions
        await getStats();
        await getUsers();
        await getFacts();
    }, []);

    useEffect(() => {
        // get data on mount
        getData();
        // get data every two seconds
        const interval = setInterval(() => getData(), 2000);
        // clean up interval (VERY IMPORTANT - LEAVING INTERVALS WILL CAUSE SPAM)
        return () => clearInterval(interval);
    }, [getData]);

    return (
        <AppContainer>
            <HeaderWrapper>
                <Logo src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" />
                <div>
                    <TitleText>Interesting Facts Dashboard</TitleText>
                    <SubTitle>By: Joseph Gotengco | A01057183</SubTitle>
                </div>
            </HeaderWrapper>
            <ContentWrapper>
                <AppSection>
                    <AppSectionHeader>Stats:</AppSectionHeader>
                    {/* Average jokes  */}
                    <StatLabel>Average Jokes Added (Weekly):</StatLabel>
                    <StatValue>{stats.avg_jokes_added_weekly}</StatValue>
                    {/* Most popular tag */}
                    <StatLabel>Most popular tag:</StatLabel>
                    <StatValue>{stats.most_popular_tag}</StatValue>
                    {/* Total facts */}
                    <StatLabel>Total Facts:</StatLabel>
                    <StatValue>{stats.num_facts}</StatValue>
                    {/* Total subscribed users */}
                    <StatLabel>Total Subscribed Users:</StatLabel>
                    <StatValue>{stats.num_subscribed_users}</StatValue>
                    {/* Total users */}
                    <StatLabel>Total Users:</StatLabel>
                    <StatValue>{stats.num_users}</StatValue>
                    <StatLabel>Datetime:</StatLabel>
                    <StatValue>{stats.datetime}</StatValue>
                </AppSection>
                <AppSection>
                    <AppSectionHeader>Audit - User:</AppSectionHeader>
                    {/* USER EXAMPLE */}
                    <StatLabel>User ID:</StatLabel>
                    <StatValue>{user.user_id}</StatValue>
                    <StatLabel>Username:</StatLabel>
                    <StatValue>{user.username}</StatValue>
                    <StatLabel>Subscribed:</StatLabel>
                    <StatValue>
                        {user.subscribed ? user.subscribed.toString() : ""}
                    </StatValue>
                    <StatLabel>Account Created On:</StatLabel>
                    <StatValue>{user.timestamp}</StatValue>
                    <StatLabel>User Registration Date:</StatLabel>
                    <StatValue>{user.datetime}</StatValue>
                </AppSection>
                <AppSection>
                    <AppSectionHeader>Audit - Fact:</AppSectionHeader>
                    {/* USER EXAMPLE */}
                    <StatLabel>Fact ID:</StatLabel>
                    <StatValue>{fact.fact_id}</StatValue>
                    <StatLabel>Fact:</StatLabel>
                    <StatValue>{fact.fact}</StatValue>
                    <StatLabel>User ID:</StatLabel>
                    <StatValue>{fact.user_id}</StatValue>
                    <StatLabel>Tags:</StatLabel>
                    <StatValue>{fact.tags.join(", ")}</StatValue>
                    <StatLabel>Fact Registration Date:</StatLabel>
                    <StatValue>{fact.datetime}</StatValue>
                </AppSection>
            </ContentWrapper>
        </AppContainer>
    );
}

export default App;
