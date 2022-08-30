import DeleteEventButton from "./DeleteEventButton"
import LeaveEventButton from "./LeaveEventButton"


function EventDetailButtons({user, eventDetail, setDeleteChannelInformation, setLeaveChannelInformation}) {
    if (eventDetail.owner_id === user.pk) {
        return(
            <>
            <DeleteEventButton setDeleteChannelInformation={setDeleteChannelInformation} eventDetail={eventDetail}/>
            </>
        )

    }
    else {
        // if user is not the event onwer they can leave
        return(
            <LeaveEventButton setLeaveChannelInformation={setLeaveChannelInformation} eventDetail={eventDetail}/>
        )
    }

}

export default EventDetailButtons