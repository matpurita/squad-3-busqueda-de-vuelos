import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useFlights } from "../contexts/FlightsContext";
import { useSearch } from "../contexts/SearchContext";
import FlightDetail from "./FlightDetail";
import { useAuth } from "../contexts/AuthContext";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function Sidebar() {
    const { selectedFlight, setSelectedFlight, bookingFlights } = useFlights();
    const { tripType } = useSearch();
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const { reservarVuelo } = useFlights();

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
        <Drawer sx={{
    '& .MuiDrawer-paper': {
      width: {
        xs: 240,   // móviles
        sm: 280,
        md: 365,   // desktop
        lg: 450,
      },
      padding: 1,
    },
  }} open={open} onClose={onSidebarClose} anchor='right'>
     {/* 🧭 Header con botón para cerrar */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Detalle del vuelo</Typography>

                <IconButton onClick={onSidebarClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            {open && <FlightDetail flight={selectedFlight} user={user} reservarVuelo={reservarVuelo} bookingFlights={bookingFlights} />}
        </Drawer>
    );
}