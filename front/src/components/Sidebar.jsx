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
        <Drawer 
            sx={{
                '& .MuiDrawer-paper': {
                    width: {
                        xs: 280,
                        sm: 320,
                        md: 400,
                        lg: 480,
                    },
                    padding: 2,
                    backgroundColor: 'background.paper',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                },
            }} 
            open={open} 
            onClose={onSidebarClose} 
            anchor='right'
        >
            {/* 🧭 Header con botón para cerrar */}
            <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                mb={2}
                pb={2}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: 'primary.main',
                    }}
                >
                    Detalle del vuelo
                </Typography>

                <IconButton 
                    onClick={onSidebarClose}
                    sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {open && <FlightDetail flight={selectedFlight} user={user} reservarVuelo={reservarVuelo} bookingFlights={bookingFlights} />}
        </Drawer>
    );
}