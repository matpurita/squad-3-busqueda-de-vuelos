import { Drawer } from "@mui/material";
import { useState } from "react";
import { useFlights } from "../contexts/FlightsContext";
import Flight from "./Flight";
import FlightDetail from "./FlightDetail";

export default function Sidebar() {

    const { selectedFlight, setSelectedFlight } = useFlights();

    const open = !(selectedFlight === undefined || selectedFlight == null)

    const onSidebarClose = (event, reason) => {
        setSelectedFlight(undefined)
    }

    return (
        <Drawer open={open} onClose={onSidebarClose}  anchor='right'>
            {open && <FlightDetail flight={selectedFlight}/> }
        </Drawer>
    )
}