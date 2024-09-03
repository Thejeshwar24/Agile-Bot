
// import { render, screen , fireEvent,waitFor} from '@testing-library/react';
// import EpicComponent from '../components/Epics.jsx';
// import { MemoryRouter } from 'react-router-dom';
// import axios from 'axios';
// import { vi, test, expect } from 'vitest';

// vi.mock('axios')


// test('renders the epic form', () => {
//   render(
//     <MemoryRouter>
//       <EpicComponent />
//     </MemoryRouter>
//   );

//   expect(screen.getByLabelText(/Epic Name/i)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Owner/i)).toBeInTheDocument();
//   expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();
//   expect(screen.getByText(/Submit/i)).toBeInTheDocument();
// });

// test('shows validation errors on submit with empty fields', async () => {
//   render(
//     <MemoryRouter>
//       <EpicComponent />
//     </MemoryRouter>
//   );

//   fireEvent.click(screen.getByText(/Submit/i));

//   expect(await screen.findByText(/Please input the epic name!/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Please input the description!/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Please select an owner!/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Please select a color!/i)).toBeInTheDocument();
// });

// test('displays validation errors when required fields are empty', async () => {
//   render(
//     <MemoryRouter>
//       <EpicComponent />
//     </MemoryRouter>
//   );

//   fireEvent.click(screen.getByText(/Submit/i));

//   expect(await screen.findByText(/Please input the epic name!/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Please input the description!/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Please select an owner!/i)).toBeInTheDocument();
//   expect(await screen.findByText(/Please select a color!/i)).toBeInTheDocument();
// });






