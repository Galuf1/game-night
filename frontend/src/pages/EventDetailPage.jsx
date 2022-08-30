import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import EventDetailList from "../components/List/EventDetailList"
import DialogGame from "../components/Dialog/DialogGame"

export default function EventDetailPage({user, setDeleteChannelInformation, setLeaveChannelInformation}) {

	let { eventId } = useParams();

	const [eventDetail, setEventDetail] = useState(null);
	const [games, setGames] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);

	

	const [gameInfo, setGameInfo] = useState(null)
    const [displayBasic2, setDisplayBasic2] = useState(false);
	

    useEffect(() => {
		axios
		.get(`/userevents/${eventId}`)
		.then((response) => {
			console.log('get events response.data', response.data)
			setGames(Object.values(response.data[0].games))
			setStartTime(moment(response.data[0].start_time).format('MMMM Do YYYY, h:mm a'))
			setEndTime(moment(response.data[0].end_time).format('MMMM Do YYYY, h:mm a'))
			setEventDetail(response.data[0])
		})
	}, [])

    return(
        <div style={{'margin-left': '20%', 'margin-right': '20%'}}>
		{eventDetail &&
			<EventDetailList eventDetail={eventDetail} games={games} startTime={startTime} endTime={endTime} setGameInfo={setGameInfo} setDisplayBasic2={setDisplayBasic2} user={user} setDeleteChannelInformation={setDeleteChannelInformation} setLeaveChannelInformation={setLeaveChannelInformation}/>

		}
		{gameInfo &&
			<DialogGame gameInfo={gameInfo} displayBasic2={displayBasic2} setDisplayBasic2={setDisplayBasic2}/>
		}
        </div>
    )
}
