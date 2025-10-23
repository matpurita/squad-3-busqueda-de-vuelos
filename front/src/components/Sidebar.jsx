import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useFlights } from "../contexts/FlightsContext";
import { useSearch } from "../contexts/SearchContext";
import FlightDetail from "./FlightDetail";

export default function Sidebar() {
    const { selectedFlight, setSelectedFlight } = useFlights();
    const { tripType } = useSearch();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!selectedFlight) {
            setOpen(false);
            return;
        }

        if (tripType === 'oneway') {
            const shouldOpen = !!selectedFlight.ida;
            setOpen(shouldOpen);
        }
        else if (tripType === 'roundtrip') {
            const shouldOpen = !!(selectedFlight.ida && selectedFlight.vuelta);
            setOpen(shouldOpen);
        }
    }, [selectedFlight, tripType]);

    const onSidebarClose = (event, reason) => {
        setSelectedFlight(null);
        setOpen(false);
    };

    return (
        <Drawer open={open} onClose={onSidebarClose} anchor='right'>
            {open && <FlightDetail flight={selectedFlight} />}
        </Drawer>
    );
}