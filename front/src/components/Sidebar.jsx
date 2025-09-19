import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useFlights } from "../contexts/FlightsContext";
import FlightDetail from "./FlightDetail";

export default function Sidebar() {

    const { selectedFlight, setSelectedFlight } = useFlights();

    useEffect(() => {
        if (!selectedFlight) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [selectedFlight]);

    const [open, setOpen] = useState(false);


    const onSidebarClose = (event, reason) => {
        setOpen(false);
    
    }

    return (
        <Drawer open={open} onClose={onSidebarClose}  anchor='right'>
            {open && <FlightDetail flight={selectedFlight}/> }
        </Drawer>
    )
}