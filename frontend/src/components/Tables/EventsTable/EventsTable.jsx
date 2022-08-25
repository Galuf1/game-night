import React, { Component, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import './EventsTable.css'


export const EventsTable = () => {

	const [event, setEvent] = useState(null)


	useEffect(() => {
		axios
		.get('/userevents/table')
		.then((response) => {
			let data = []
			for(let item in response.data) {
				data.push(response.data[item].fields)
			}
			setEvent(data)
			
		})
		.catch((error) => {console.log('ERROR', error);})
	}, [])

	function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
    
        newDate.setHours(hours - offset);
    
        return newDate;   
    }

    const timeBodyTemplate = (rowData) => {
        let date = convertUTCDateToLocalDate(new Date(rowData.start_time))
        return date.toLocaleString();
    }

	return (
		<DataTable value={event} paginator rows={15} filterDisplay="menu">
			<Column field="name" header="Event Name" filter />
			<Column field="category" header="Category" filter />
			{/* <Column field="description" header="Description" filter />
			<Column field="address_1" header="Location" filter /> */}
			<Column body={timeBodyTemplate} header="Date" sortable dataType="date" />
		</DataTable>
	);
};
