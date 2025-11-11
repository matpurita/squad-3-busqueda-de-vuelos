/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FlightDetail from './FlightDetail';
import '@testing-library/jest-dom'

describe('Flight Component', () => {

  const user = {}
  const reservarVuelo = jest.fn();

  const VUELO_IDA = {ida: {
    airline: 'Aerolineas Argentinas',
    fechaSalida: '2024-12-01T10:00:00Z'
    }
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

    // Cuando renderizo el componente
    render(<FlightDetail flight={VUELO_IDA} user={user} reservarVuelo={reservarVuelo}/>);

    // Entonces debe mostrar el nombre de la aerolinea"
    expect(screen.getByText('Aerolineas Argentinas')).toBeInTheDocument();
    // expect(screen.getByText('Latam')).toBeInTheDocument();
    // expect(screen.getByText('3h 30m')).toBeInTheDocument();
    // expect(screen.getByText('4h 15m')).toBeInTheDocument();
    // expect(screen.getByText('$500')).toBeInTheDocument();
    // expect(screen.getByText('01/12/2024')).toBeInTheDocument();
    // expect(screen.getByText('10/12/2024')).toBeInTheDocument();
  });

});