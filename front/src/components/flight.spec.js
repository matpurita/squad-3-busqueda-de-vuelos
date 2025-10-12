/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import FlightDetail from './FlightDetail';
import '@testing-library/jest-dom'

describe('Flight Component', () => {
  it('cuando tiene un vuelo de ida debe mostrar un titulo', () => {

    // Dado el siguiente vuelo
    const flight = {
      ida: {}
    };

    // Cuando renderizo el componente
    render(<FlightDetail flight={flight}/>);

    // Entonces debe mostrar el titulo "Vuelo de Ida"
    expect(screen.getByText('Vuelo de Ida')).toBeInTheDocument();
  });

  it('cuando tiene un vuelo de ida debe mostrar el nombre de la aerolinea', () => {

    // Dado el siguiente vuelo
    const flight = {
      ida: {
        airline: 'Aerolineas Argentinas'
      }
    };

    // Cuando renderizo el componente
    render(<FlightDetail flight={flight}/>);

    // Entonces debe mostrar el nombre de la aerolinea"
    expect(screen.getByText('Aerolineas Argentinas')).toBeInTheDocument();
  });
});