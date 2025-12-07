import { describe, it, expect, vi } from 'vitest';
import { fetchFact } from './script.js'; 

const mockFact = {
    id: '1234',
    text: 'Este es un hecho simulado para el test.',
    source: 'api'
};

global.fetch = vi.fn();

describe('fetchFact', () => {
    
    it('debe devolver un hecho cuando la llamada a la API es exitosa', async () => {
        
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockFact,
        });

        const data = await fetchFact();

        expect(data).toEqual(mockFact);
       
        expect(fetch).toHaveBeenCalledOnce();
    });

    
    it('debe devolver un mensaje de error si la respuesta HTTP no es ok', async () => {
      
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });

        const data = await fetchFact();

       
        expect(data).toEqual({ error: 'No se pudo cargar el hecho. Inténtalo de nuevo más tarde.' });
    });
});