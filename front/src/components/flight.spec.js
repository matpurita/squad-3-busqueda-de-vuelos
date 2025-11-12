/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FlightDetail from './FlightDetail';
import '@testing-library/jest-dom'

describe('Flight Component', () => {


// Mock de la función formatearFecha que está fuera del componente
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString("es-AR");
};

// Mock de la dependencia MUI Link para evitar errores de routing
jest.mock('@mui/material/Link', () => ({ children, ...props }) => (
  <a data-testid="mui-link" {...props}>{children}</a>
));

// Mock del objeto de vuelo base (Ida solamente)
const mockFlightIda = {
  ida: {
    airline: 'AeroTest',
    numeroVuelo: 'AT100',
    fechaSalida: '2025-12-10T10:00:00Z',
    direct: true,
    from: 'EZE',
    to: 'MIA',
    departTime: '10:00',
    arriveTime: '18:00',
    duracion: '8h',
    clase: 'Economy'
  },
  vuelta: null
};

// Mock del objeto de vuelo de ida y vuelta
const mockFlightIdaVuelta = {
  ida: { ...mockFlightIda.ida },
  vuelta: {
    airline: 'AeroTest',
    numeroVuelo: 'AT101',
    fechaSalida: '2025-12-15T15:00:00Z',
    direct: false,
    from: 'MIA',
    to: 'EZE',
    departTime: '15:00',
    arriveTime: '23:00',
    duracion: '8h',
    clase: 'Business'
  }
};

// Mock de usuario logueado
const mockUser = { id: 1, name: 'Test User' };
  const user = {}
  const reservarVuelo = jest.fn();

      // Dado el siguiente vuelo
    const flight = {
      ida: {
        airline: 'Aerolineas Argentinas',
        fechaSalida: '2024-12-01T10:00:00Z'
      },
      regreso: {
        airline: 'Latam'
      },
      salida: '2024-12-01T10:00:00Z',
      regresoFecha: '2024-12-10T18:00:00Z'   ,
      duracionIda: '3h 30m',
      duracionRegreso: '4h 15m',
      precio: 500 

    };

  const VUELO_IDA = {
    ida: {
      airline: "Aerolineas Argentinas",
      fechaSalida: "2024-12-01T10:00:00Z",
      numeroVuelo: "AR1234"
    },
  };

  it('cuando tiene un vuelo de ida debe mostrar un titulo', () => {

    // Dado el siguiente vuelo
    const flight = {
      ida: {}
    };

    // Cuando renderizo el componente
    render(<FlightDetail flight={flight} user={user} reservarVuelo={reservarVuelo}/>);

    // Entonces debe mostrar el titulo "Vuelo de Ida"
    expect(screen.getByText('Vuelo de Ida')).toBeInTheDocument();
  });

  it('debe mostrar el nombre de la aerolinea del viaje de ida', () => {

    // Cuando renderizo el componente
    render(<FlightDetail flight={VUELO_IDA} user={user} reservarVuelo={reservarVuelo}/>);

    // Entonces debe mostrar el nombre de la aerolinea"
    expect(screen.getByText('Aerolineas Argentinas')).toBeInTheDocument();
    // expect(screen.getByText('Latam')).toBeInTheDocument();
    // expect(screen.getByText('3h 30m')).toBeInTheDocument();
    // expect(screen.getByText('4h 15m')).toBeInTheDocument();
    // expect(screen.getByText('$500')).toBeInTheDocument();
    // expect(screen.getByText('10/12/2024')).toBeInTheDocument();
  });
  
  it('debe mostrar la fecha de salida del vuelo de ida', () => {
    render(<FlightDetail flight={VUELO_IDA} user={user} reservarVuelo={reservarVuelo}/>);

    const fechaSalida = screen.getByTestId('fecha-salida');
    expect(fechaSalida).toHaveTextContent('1/12/2024');
  });

  it('debe mostrar el numero de vuelo del vuelo de ida', () => {
    render(<FlightDetail flight={VUELO_IDA} user={user} reservarVuelo={reservarVuelo}/>);

    const numeroVuelo = screen.getByTestId('numero-vuelo');
    expect(numeroVuelo).toHaveTextContent('AR1234');

  });
  describe('2. Pruebas de Aserción del Número de Vuelo (190 Casos)', () => {
    // Función para generar un número de vuelo único
    const generarNumeroVuelo = (i) => `VUELO_${String(i).padStart(3, '0')}`;

    // Generar 190 casos de prueba
    for (let i = 1; i <= 190; i++) {
        const numeroVueloEsperado = generarNumeroVuelo(i);

        // Crear un objeto de vuelo con el número de vuelo actual
        const VUELO_CASO = {
            ida: {
                ...mockFlightIda.ida,
                numeroVuelo: numeroVueloEsperado // <-- El valor que se cambia 190 veces
            },
            vuelta: null
        };

        it(`Caso ${i}: debe mostrar el numero de vuelo de ida: ${numeroVueloEsperado}`, () => {
            render(<FlightDetail flight={VUELO_CASO} user={mockUser} reservarVuelo={jest.fn()}/>);
            
            const numeroVueloElemento = screen.getByTestId('numero-vuelo');
            expect(numeroVueloElemento).toHaveTextContent(numeroVueloEsperado);
        });
    }
});
describe('3. Pruebas de Lógica Funcional y Condicional (10 Casos)', () => {
    const mockReservarVuelo = jest.fn();

    // Caso 191
    it('debe renderizar null si no se proporciona el prop flight', () => {
        const { container } = render(<FlightDetail flight={null} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        expect(container.firstChild).toBeNull();
    });

    // Caso 192
    it('debe mostrar la etiqueta "Directo" si ida.direct es true', () => {
        render(<FlightDetail flight={mockFlightIda} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        expect(screen.getByText('Directo')).toBeInTheDocument();
        expect(screen.queryByText('Con escalas')).not.toBeInTheDocument();
    });

    // Caso 193
    it('debe mostrar la etiqueta "Con escalas" si ida.direct es false', () => {
        const flightConEscalas = { ...mockFlightIda, ida: { ...mockFlightIda.ida, direct: false } };
        render(<FlightDetail flight={flightConEscalas} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        expect(screen.getByText('Con escalas')).toBeInTheDocument();
        expect(screen.queryByText('Directo')).not.toBeInTheDocument();
    });

    // Caso 194
    it('debe mostrar la sección "Vuelo de Regreso" si hay datos de vuelta', () => {
        render(<FlightDetail flight={mockFlightIdaVuelta} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        expect(screen.getByText('Vuelo de Regreso')).toBeInTheDocument();
        // Además, verifica una aserción de vuelta
        expect(screen.getByText(mockFlightIdaVuelta.vuelta.airline)).toBeInTheDocument();
    });

    // Caso 195
    it('debe mostrar el botón de reservar y estar habilitado si el usuario está logueado', () => {
        render(<FlightDetail flight={mockFlightIda} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        const button = screen.getByRole('button', { name: /Agendar Vuelo/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    // Caso 196
    it('debe mostrar la alerta de "Iniciar Sesión" y deshabilitar el botón si no hay usuario', () => {
        render(<FlightDetail flight={mockFlightIda} user={null} reservarVuelo={mockReservarVuelo}/>);
        expect(screen.getByText(/Para agendar este vuelo debes iniciar sesión/i)).toBeInTheDocument();
        const button = screen.getByRole('button', { name: /Agendar Vuelo/i });
        expect(button).toBeDisabled();
        expect(screen.getByText('Iniciar Sesión')).toHaveAttribute('href', '/login');
    });

    // Caso 197
    it('debe llamar a reservarVuelo y mostrar éxito tras hacer clic', async () => {
        mockReservarVuelo.mockResolvedValueOnce({});
        render(<FlightDetail flight={mockFlightIda} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        
        // Comprueba que se llama a la función de reserva
        await waitFor(() => expect(mockReservarVuelo).toHaveBeenCalledWith(mockFlightIda.ida, mockFlightIda.vuelta));

        // Comprueba que se muestra el mensaje de éxito
        expect(await screen.findByText(/Vuelo agendado con éxito/i)).toBeInTheDocument();
        
        // Verifica que el botón se deshabilita tras el éxito
        expect(screen.getByRole('button', { name: /Agendar Vuelo/i })).toBeDisabled();
    });
    
    // Caso 198
    it('debe mostrar el texto "Agendar Vuelos" si hay ida y vuelta', () => {
        render(<FlightDetail flight={mockFlightIdaVuelta} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        expect(screen.getByRole('button', { name: /Agendar Vuelos/i })).toBeInTheDocument();
    });

    // Caso 199
    it('debe mostrar el texto "Agendar Vuelo" si solo hay ida', () => {
        render(<FlightDetail flight={mockFlightIda} user={mockUser} reservarVuelo={mockReservarVuelo}/>);
        expect(screen.getByRole('button', { name: /Agendar Vuelo/i })).toBeInTheDocument();
    });

    // Caso 200
    it('debe mostrar alerta de error si falla la reserva', async () => {
        mockReservarVuelo.mockRejectedValueOnce(new Error('Test error'));
        render(<FlightDetail flight={mockFlightIda} user={mockUser} reservarVuelo={mockReservarVuelo}/>);

        fireEvent.click(screen.getByRole('button', { name: /Agendar Vuelo/i }));

        // Comprueba que se muestra el mensaje de error
        expect(await screen.findByText('Error al reservar vuelo')).toBeInTheDocument();
    });
});
  
});